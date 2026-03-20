import os
import joblib

# Load the trained model and vectorizer using paths relative to this file
_current_dir = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(_current_dir, "intent_model.pkl"))
vectorizer = joblib.load(os.path.join(_current_dir, "intent_vectorizer.pkl"))


# Function to predict the intent of a user input
def predict_intent(user_input):
    # Convert the user input into the same features used for training
    user_input_vectorized = vectorizer.transform([user_input])

    # Predict the intent
    predicted_intent = model.predict(user_input_vectorized)[0]

    return predicted_intent
