from flask import Blueprint, render_template, request, jsonify
from services.analyzer import analyze_business_data
from services.ai_engine import ask_gemini

import os
import tempfile

analysis_controller = Blueprint(
    "analysis",
    __name__
)


@analysis_controller.route("/")
def dashboard():
    return render_template("index.html")


@analysis_controller.route("/analyze", methods=["POST"])
def analyze():

    if "file" not in request.files:
        return jsonify({
            "error": "No file uploaded."
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected."
        }), 400

    if not file.filename.lower().endswith(".csv"):
        return jsonify({
            "error": "Only CSV files are supported."
        }), 400

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".csv"
        ) as temp:

            file.save(temp.name)
            temp_path = temp.name

        result = analyze_business_data(temp_path)

        return jsonify(result)

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 400

    finally:

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
@analysis_controller.route("/ask-gemini", methods=["POST"])
def ask_gemini_route():
    try:
        data = request.get_json()

        question = data.get("question", "").strip()
        business_data = data.get("business_data", {})

        if not question:
            return jsonify({
                "error": "Please enter a question."
            }), 400

        answer = ask_gemini(
            business_data,
            question
        )

        return jsonify(answer)

    except Exception as error:
        print("GEMINI ERROR:", repr(error))

        return jsonify({
            "error": str(error)
        }), 500