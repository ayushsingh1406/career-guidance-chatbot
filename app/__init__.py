import os
from flask import Flask
from flask_session import Session


def create_app():
    app = Flask(__name__)

    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key-change-me")
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_FILE_DIR"] = os.path.join("/tmp", "flask_session")
    app.config["SESSION_FILE_THRESHOLD"] = 100
    Session(app)
    return app
