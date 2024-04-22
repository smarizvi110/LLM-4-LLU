from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'LLM-4-LLU • Backend v0.0.1'

@app.route('/get_response', methods = ['POST'])
def get_Response():
    # TEMPORARY TESTING CODE
    if request.method != 'POST': return

    data = {
        "type": "chat",
        "body": "test response",
    }

    return jsonify(data)
