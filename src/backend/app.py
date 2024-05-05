from flask import Flask, jsonify, request
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings, save
from dotenv import load_dotenv
from openai import OpenAI
import requests
import base64
import json
import os

load_dotenv()
SHARED_CACHE = os.environ.get("SHARED_CACHE")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
ELEVEN_API_KEY = os.environ.get("ELEVEN_API_KEY")
with open('pre_prompt_en.txt', 'r', encoding="utf-8") as file:
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
    print("Starting!")
    if request.method != 'POST':
        return jsonify({"error": "Invalid request method."}), 405

    data = request.get_json()
    query = None
    image = None

    print(data)

    # Process different message types
    if data['type'] == 'ptt':
        audio_path = os.path.join(SHARED_CACHE, data['filename'])
        try:
            with open(audio_path, 'rb') as audio_file:
                query = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language="ur"
                ).text
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        query = "{" + f'"audio": "{query}"' + "}"

    elif data['type'] == 'chat':
        query = "{" + f'''"text": "{data.get('message', '')}"''' + "}"

    elif data['type'] == 'image':
        print("loading image")
        image_path = os.path.join(SHARED_CACHE, data['filename'])
        with open(image_path, "rb") as image_file:
            img = base64.b64encode(image_file.read()).decode('utf-8')

        image = {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{img}"
            }
        }

    # if not query:
    #     return jsonify({"error": "Invalid or missing query."}), 400

    print(query)

    # Initialize message history if the user is new
    user_id = data['chatId']
    if user_id not in message_history.keys():
        message_history[user_id] = [
            {"role": "system", "content": PRE_PROMPT},
        ]

    # Append the new query to the user's message history
    print("Adding message to queue")
    if query:
        message_history[user_id].append({"role": "user", "content": query})
    if image:
        message_history[user_id].append({"role": "user", "content": [image]})

    prev_len = len(message_history[user_id])

    # Request completion from OpenAI's GPT-4 Turbo
    try:
        # response = client.chat.completions.create(
        #     model="gpt-4-turbo",
        #     messages=message_history[user_id],
        # ).choices[0].message.content

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }

        payload = {
            "model": "gpt-4-turbo",
            "messages": message_history[user_id],
            "max_tokens": 3000
        }
        
        text, aud = "", ""
        while text == "" and aud == "":
            print("Sending OpenAI request")
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            # print(response)
            # response = response.choices[0].message.content
            response = response.json()['choices'][0]['message']['content']
            print("Received OpenAI response")
            print(response)

            try:
                obj = json.loads(response)
                text = obj.get("text", "")
                aud = obj.get("audio", "")
            except:
                aud = response

        print("Generating audio")
        # Generate audio response using Eleven Labs API
        if aud != "":
            audio = elClient.generate(
                text=aud,
                voice="Matilda",
                model="eleven_multilingual_v2"
            )

            print("Saving audio")

            save(audio, os.path.join(SHARED_CACHE, f"{user_id}.mp3"))

        if prev_len != len(message_history[user_id]):
            return jsonify({"error": "Message history mismatch."}), 500

        data = [{
            "type": "ptt",
            "filename": f"{user_id}.mp3",
        }, {
            "type": "chat",
            "message": text,
        }]

        return jsonify(data)

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
