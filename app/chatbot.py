import requests
import subprocess
from config import OPENROUTER_API_KEY, OPENROUTER_BASE_URL
from app.intent_classifier import predict_intent  # Importing the predict_intent function

# Load career knowledge
with open("app/career_knowledge.txt", "r", encoding="utf-8") as f:
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
    intent = predict_intent(last)  # Use the imported function to predict the intent

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
        resp = requests.post(OPENROUTER_BASE_URL, headers=headers, json=payload)
        data = resp.json()
        if "choices" in data:
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print("OpenRouter error:", e)

    # 4) Fallback to local Ollama/Mistral
    try:
        history_text = "\n".join(f"{m['role']}: {m['content']}" for m in chat_history)
        prompt = (
            "You are Prometheus, the advanced AI career counselor developed by Ayush Kumar Singh and Heramb Pandey, "
            "students at Lovely Professional University. You answer based on the following career knowledge:\n\n"
            + CAREER_KNOWLEDGE
            + "\n\nChat history:\n"
            + history_text
            + "\nassistant:"
        )
        result = subprocess.run(
            ["ollama", "run", "mistral"],
            input=prompt,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            print("Ollama error:", result.stderr)
    except Exception as e:
        print("Ollama exception:", e)

    return "Sorry, I’m having trouble right now. Please try again later."

