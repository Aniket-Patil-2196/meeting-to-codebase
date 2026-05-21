# Meeting → Codebase 🚀

A powerful web application that transforms product meeting transcripts into actionable development artifacts using AI. Simply paste your meeting notes, and it automatically generates GitHub Issues, User Stories, REST API Schemas, and a complete boilerplate Folder Structure.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS (Dark Theme)
- **Backend:** Node.js, Express.js, MongoDB + Mongoose
- **AI Service:** Python, FastAPI, Anthropic Claude API (claude-sonnet-4-20250514)

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **Python** (v3.9 or higher)
- **MongoDB** (Running locally on `mongodb://localhost:27017` or a cloud URI)

---

## 🚀 How to Start the Project (Step-by-Step)

The project consists of three separate services that need to run concurrently: the AI Service, the Backend, and the Frontend.

### Step 1: Clone or Navigate to the Project Directory
Ensure you are in the root directory of the project.

### Step 2: Set Up the AI Service (Python/FastAPI)

1. Navigate to the AI service directory:
   ```bash
   cd ai-service
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Open the `ai-service/.env` file and add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
   ```
4. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   *The AI service will now be running on `http://localhost:8000`.*

### Step 3: Set Up the Backend (Node.js/Express)

1. Open a **new terminal window/tab** and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Open the `backend/.env` file and configure your variables. It should look like this:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/meeting-to-codebase
   AI_SERVICE_URL=http://localhost:8000
   
   # Optional: For automatic GitHub issue creation
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repo_name
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The Backend service will now be running on `http://localhost:5000`.*

### Step 4: Set Up the Frontend (React/Vite)

1. Open a **third terminal window/tab** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The Frontend will now be running on `http://localhost:5173`.*

---

## 🎉 Usage

Once all three services are running:
1. Open your browser and navigate to **`http://localhost:5173`**.
2. Paste a meeting transcript into the text area. 
   *(Example: "We need a user login system, profile page, and the ability to upload a profile picture. MongoDB for the database, REST API backend.")*
3. Click **Generate** and watch the magic happen! 🚀

---

## 🛑 Troubleshooting

- **"AI service error: Invalid Anthropic API key"**: Ensure you have replaced the placeholder in `ai-service/.env` with a valid Anthropic API key.
- **MongoDB Connection Error**: Ensure your local MongoDB server is running, or update the `MONGO_URI` in `backend/.env` to point to a valid MongoDB cluster (e.g., MongoDB Atlas).
- **GitHub Issues not created**: If GitHub credentials are not provided in `backend/.env`, the app will still work and generate the issues on screen, but it will skip pushing them to your GitHub repository.
