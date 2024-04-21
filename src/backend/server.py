from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'LLM-4-LLU • Backend v0.0.1'
