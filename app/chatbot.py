import os
import requests
from config import OPENROUTER_API_KEY, OPENROUTER_BASE_URL
from app.intent_classifier import predict_intent

# Load career knowledge using a path relative to this file
_current_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(_current_dir, "career_knowledge.txt"), "r", encoding="utf-8") as f:
    CAREER_KNOWLEDGE = f.read()


def get_chat_response(chat_history):
    last = chat_history[-1]["content"].strip().lower()

    creator_keywords = [
        "who created you", "who made you", "who are your developers",
        "who is your creator", "who built you", "developer", "developers",
        "created by", "made you", "your makers", "your builders", "your founders"
    ]
    if any(phrase in last for phrase in creator_keywords):
        return "I was developed by Ayush Singh and Heramb Pandey, both 20 years old, pursuing a B.Tech degree at Lovely Professional University."

    # 1) Use the predict_intent function to detect user intent
    intent = predict_intent(last)

    # Inject detected intent as a system message
    intent_msg = {
        "role": "system",
        "content": f"Detected user intent: {intent}. Respond appropriately."
    }
    if not any(m.get("role") == "system" and "Detected user intent" in m.get("content", "")
               for m in chat_history):
        chat_history.insert(0, intent_msg)

    # 2) Inject Prometheus identity + developer info (once)
    identity_msg = {
        "role": "system",
        "content": (
            "You are Prometheus, the advanced Career Counseling Assistant. "
            "You are created to assist users with career advice, mental health, and market trends. "
            "Use fire or light metaphors occasionally when appropriate. "
            "You were developed by Ayush Kumar Singh and Heramb Pandey, both 20 years old, "
            "currently pursuing a B.Tech degree at Lovely Professional University. "
            "Always identify yourself as Prometheus when introducing yourself."
        )
    }
    if not any(m.get("role") == "system" and "You are Prometheus" in m.get("content", "")
               for m in chat_history):
        chat_history.insert(0, identity_msg)

    # 3) OpenRouter API call
    try:
        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": chat_history,
            "temperature": 0.7
        }

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        print("Trying OpenRouter API...")

        resp = requests.post(
            OPENROUTER_BASE_URL,
            headers=headers,
            json=payload,
            timeout=10
        )

        print("API STATUS CODE:", resp.status_code)

        if resp.status_code == 200:
            data = resp.json()
            if "choices" in data:
                print("✅ USING OPENROUTER API")
                return data["choices"][0]["message"]["content"]
            else:
                print("⚠ API returned unexpected structure:", data)

        else:
            print("❌ API FAILED")
            print("Response:", resp.text)

    except Exception as e:
        print("❌ OpenRouter exception:", e)

    return "Sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment."
