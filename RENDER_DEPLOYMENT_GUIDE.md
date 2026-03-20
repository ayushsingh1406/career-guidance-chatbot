# Guide to Deploying Your Career Chatbot on Render

Your project is fully configured for Render. All necessary files (`render.yaml`, `Procfile`, `requirements.txt`) are present and correctly configured. The internal Python code is also adapted to Render's free tier limits (such as routing session fles to `/tmp`).

Follow these steps to deploy your bot:

## Step 1: Push Your Code to GitHub (If Not Already Done)

Render connects directly to your GitHub repository to deploy code automatically.

1. Open a terminal in this project folder (`a:\PROJECTS\career_chatbot`).
2. Initialize git and push to a new GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git branch -M main
   # Follow GitHub's instructions to link your remote repository:
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```
*(Note: Your `.env` and `venv` are safely ignored by `.gitignore` and won't be pushed).*

## Step 2: Deploy on Render using Blueprint

Since we have a `render.yaml` file, deployment is basically automated!

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New** in the top right, then select **Blueprint**.
3. Connect your GitHub account and select your repository (`your-repo-name`).
4. Render will automatically detect the settings in `render.yaml`.
5. Click **Apply** or **Connect**.

## Step 3: Enter Your Secret Environment Variables

During the Blueprint setup, Render will ask you for values that we marked as "sync: false" in `render.yaml`. 

Enter your API keys as follows:
- **`OPENROUTER_API_KEY`**: Paste your OpenRouter API key here.
- **`OPENROUTER_BASE_URL`**: Paste your base URL (usually `https://openrouter.ai/api/v1`).

*(Render will automatically generate a secure `SECRET_KEY` for Flask, so you do not need to enter one manualy!)*

## Step 4: Wait for Deployment

1. Render will start the build process (`pip install -r requirements.txt`).
2. Once the build is finished, it will start your app with Gunicorn (`gunicorn run:app --bind 0.0.0.0:$PORT`).
3. After a few minutes, you'll see a green **"Live"** status.
4. Click on the public URL provided by Render (e.g., `https://career-chatbot-xxxx.onrender.com`) to view your app!

---
> [!NOTE] 
> Because this uses Render's **Free Tier**, the app will go to sleep after ~15 minutes of inactivity. When someone visits the asleep app, it may take 1-2 minutes to "wake up" and respond. This is completely normal!
