from flask import Flask, send_from_directory
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/")
def serve():
    return send_from_directory("/home/alex/pj/cpas/hq-api", "main.yaml")

app.run(port=7000)
