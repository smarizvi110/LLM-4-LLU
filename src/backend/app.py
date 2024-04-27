from flask import Flask, jsonify, request
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings, save
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()
SHARED_CACHE = os.environ.get("SHARED_CACHE")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
ELEVEN_API_KEY = os.environ.get("ELEVEN_API_KEY")
with open('pre_prompt.txt', 'r', encoding="utf-8") as file:
    PRE_PROMPT = file.read()

app = Flask(__name__)
client = OpenAI(api_key=OPENAI_API_KEY)
elClient = ElevenLabs(api_key=ELEVEN_API_KEY)
message_history = {}

@app.route('/')
def hello_world():
    return 'LLM-4-LLU • Backend v0.0.1'

@app.route('/get_response', methods=['POST'])
def get_response():
    if request.method != 'POST':
        return jsonify({"error": "Invalid request method."}), 405

    data = request.get_json()
    query = None

    # Process different message types
    if data['type'] == 'ptt':
        audio_path = os.path.join(SHARED_CACHE, data['filename'])
        try:
            with open(audio_path, 'rb') as audio_file:
                query = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                ).text
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif data['type'] == 'chat':
        query = data.get('message', '')

    if not query:
        return jsonify({"error": "Invalid or missing query."}), 400

    # Initialize message history if the user is new
    user_id = data['chatId']
    if user_id not in message_history.keys():
        message_history[user_id] = [
            {"role": "system", "content": PRE_PROMPT},
        ]

    # Append the new query to the user's message history
    message_history[user_id].append({"role": "user", "content": query})
    prev_len = len(message_history[user_id])

    # Request completion from OpenAI's GPT-4 Turbo
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=message_history[user_id],
        ).choices[0].message.content

        # Generate audio response using Eleven Labs API
        audio = elClient.generate(
            text=response,
            voice="Matilda",
            model="eleven_multilingual_v2"
        )

        if prev_len != len(message_history[user_id]):
            return jsonify({"error": "Message history mismatch."}), 500

        save(audio, os.path.join(SHARED_CACHE, f"{user_id}.mp3"))

        data = {
            "type": "ptt",
            "filename": f"{user_id}.mp3",
        }

        return jsonify(data)

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
