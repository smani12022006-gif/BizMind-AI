from flask import Flask, render_template
from controllers.analysis_controller import analysis_controller
from services.analyzer import analyze_business_data



import os
import tempfile


app = Flask(__name__)
app.register_blueprint(analysis_controller)

@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)