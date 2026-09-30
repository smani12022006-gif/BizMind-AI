import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def ask_gemini(business_data, question):

    question_lower = question.lower()
    insights = business_data.get("business_insights", [])

    # Top Product
    if "product" in question_lower and (
        "best" in question_lower
        or "top" in question_lower
        or "perform" in question_lower
    ):
        for item in insights:
            if item["type"] == "product":
                return {
                    "title": "Top Product",
                    "answer": (
                        f"{item['value']} is the top-performing product "
                        f"based on sales."
                    ),
                    "details": [
                        f"Total Sales: ₹{item['metric']:,.0f}"
                    ]
                }

    # Top Region
    if "region" in question_lower and (
        "highest" in question_lower
        or "top" in question_lower
        or "best" in question_lower
    ):
        for item in insights:
            if item["type"] == "region":
                return {
                    "title": "Top Region",
                    "answer": (
                        f"{item['value']} has the highest sales "
                        f"among the analyzed regions."
                    ),
                    "details": [
                        f"Total Sales: ₹{item['metric']:,.0f}"
                    ]
                }

    # Region needing attention
    if "attention" in question_lower or "problem" in question_lower:
        regions = business_data.get("region_performance", [])

        if regions:
            lowest = min(regions, key=lambda x: x["sales"])

            return {
                "title": "Region Needing Attention",
                "answer": (
                    f"{lowest['Region']} is the region that requires "
                    f"attention because it recorded the lowest sales."
                ),
                "details": [
                    f"Sales: ₹{lowest['sales']:,.0f}",
                    f"Profit: ₹{lowest['profit']:,.0f}",
                    f"Profit Margin: {lowest['profit_margin_percent']}%",
                    f"Quantity Sold: {lowest['quantity']} units"
                ]
            }

    # Business risks
    if "risk" in question_lower:
        regions = business_data.get("region_performance", [])

        if regions:
            lowest = min(regions, key=lambda x: x["sales"])

            return {
                "title": "Main Business Risks",
                "answer": (
                    f"The main area requiring attention is the "
                    f"{lowest['Region']} region, which recorded the "
                    f"lowest sales among the analyzed regions."
                ),
                "details": [
                    f"Sales: ₹{lowest['sales']:,.0f}",
                    f"Profit: ₹{lowest['profit']:,.0f}",
                    f"Profit Margin: {lowest['profit_margin_percent']}%",
                    f"Quantity Sold: {lowest['quantity']} units"
                ]
            }

    # Profit margin
    if "margin" in question_lower:
        for item in insights:
            if item["type"] == "margin":
                return {
                    "title": "Profit Margin",
                    "answer": (
                        f"The overall profit margin is "
                        f"{item['value']}%."
                    ),
                    "details": []
                }

    # OpenRouter AI
    data = json.dumps(business_data, indent=2)

    prompt = f"""
You are BizMind AI, a professional business data assistant.

BUSINESS DATA:
{data}

USER QUESTION:
{question}

Answer using ONLY the provided business data.

Give a clear and professional business response.

Format your response as:

TITLE:
A short title

ANSWER:
A natural 2-3 sentence answer

DETAILS:
- Important metric
- Important metric
- Important metric

Do not invent numbers.
Do not make assumptions outside the provided data.
Keep the response concise and useful.
"""

    try:

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openrouter/free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            },
            timeout=30
        )

        response.raise_for_status()

        result = response.json()

        answer = result["choices"][0]["message"]["content"]

        return {
            "title": "BizMind AI",
            "answer": answer,
            "details": []
        }

    except Exception as error:

        print("OPENROUTER ERROR:", repr(error))

        return {
            "title": "AI Temporarily Unavailable",
            "answer": (
                "The AI service is temporarily unavailable, "
                "but your business analysis is still available."
            ),
            "details": []
        }