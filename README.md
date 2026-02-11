# Career Guidance Chatbot

An AI-powered Career Guidance Chatbot built using Flask and Machine Learning.  
The chatbot analyzes user queries, detects intent using a trained NLP model, and provides relevant career recommendations using a curated knowledge base.

---

## 🚀 Features

- Intent classification using a trained Scikit-learn model
- Retrieval-based career advice system
- Pre-trained vectorizer and intent model (.pkl)
- Modular Flask backend architecture
- Interactive and responsive frontend UI
- Clean project structure for scalability

---

## 🛠 Tech Stack

Backend:
- Python
- Flask
- Scikit-learn
- NumPy
- Pickle (model persistence)

Frontend:
- HTML
- CSS
- JavaScript

---

## 📂 Project Structure

career_chatbot/
│
├── app/
│   ├── chatbot.py
│   ├── intent_classifier.py
│   ├── intent_data.json
│   ├── intent_model.pkl
│   ├── intent_vectorizer.pkl
│   ├── routes.py
│   ├── train_intent_model.py
│   ├── career_knowledge.txt
│   ├── static/
│   │   ├── script.js
│   │   └── styles.css
│   └── templates/
│       └── index.html
│
├── config.py
├── run.py
├── requirements.txt
└── README.md

---

## ⚙️ How It Works

1. User sends a query through the web interface.
2. The intent classifier processes the query.
3. The trained ML model predicts user intent.
4. The chatbot retrieves appropriate career guidance from the knowledge base.
5. Response is displayed dynamically on the UI.

---

## ▶️ How To Run Locally

### 1️⃣ Clone the Repository

### 2️⃣ Navigate into Project

### 3️⃣ Create Virtual Environment

### 4️⃣ Activate Environment

### 5️⃣ Install Dependencies

### 6️⃣ Run the Application

---

## 📌 Future Improvements

- Integrate Large Language Model API (OpenAI / Gemini)
- Add user authentication
- Store chat history in database
- Deploy to cloud (Render / Railway / AWS)
- Improve recommendation scoring logic

---

## 👨‍💻 Author

Ayush Singh  
B.Tech CSE (ML Specialization)  
GitHub: https://github.com/ayushsingh1406

