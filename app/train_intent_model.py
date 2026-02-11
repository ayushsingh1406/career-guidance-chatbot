import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Load training data
with open("app/intent_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

texts = []
labels = []

for intent, examples in data.items():
    texts.extend(examples)
    labels.extend([intent] * len(examples))

# Convert text to features
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

# Train classifier
model = LogisticRegression()
model.fit(X, labels)

# Save model and vectorizer
joblib.dump(model, "app/intent_model.pkl")
joblib.dump(vectorizer, "app/intent_vectorizer.pkl")

print("✅ Model trained and saved successfully!")