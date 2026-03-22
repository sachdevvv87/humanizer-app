# 🤖 HumanizeAI — Make AI Text Sound Human

A full-stack web app that rewrites AI-generated text to sound natural and human using **Mistral 7B Instruct** (open source, free).

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-61dafb?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square)
![Model](https://img.shields.io/badge/Model-Mistral%207B-ff6b35?style=flat-square)
![Hosting](https://img.shields.io/badge/Hosting-HuggingFace%20%2B%20GitHub%20Pages-yellow?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- 🧠 **Mistral 7B Instruct** — powerful open-source LLM
- 🎨 **4 Tone Modes** — Auto, Casual, Formal, Academic
- 📊 **Word Counter** — tracks input & output word/char counts
- 📋 **Copy to Clipboard** — one-click copy of output
- 🌙 **Dark Mode** — auto-detects system preference
- ⚡ **Processing Stats** — shows time taken and word diff
- 🔒 **Rate Limited** — 10 requests/min per IP
- 🆓 **100% Free to host**

---

## 🗂️ Project Structure

```
humanizer-app/
├── frontend/                  # React + Tailwind UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ToneSelector.jsx
│   │   │   └── WordCounter.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                   # FastAPI + Mistral 7B
│   ├── main.py                # API routes
│   ├── model.py               # HuggingFace inference
│   ├── prompts.py             # Rewriting prompts
│   ├── requirements.txt
│   ├── Dockerfile             # For HuggingFace Spaces
│   └── README.md              # HF Spaces config
│
└── .github/
    └── workflows/
        └── deploy.yml         # Auto-deploy to GitHub Pages
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free [HuggingFace account](https://huggingface.co) + API token

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/humanizer-app.git
cd humanizer-app
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "HF_TOKEN=your_huggingface_token_here" > .env

# Run the server
uvicorn main:app --reload --port 8000
```

Backend will be live at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
```

Frontend will be live at: `http://localhost:5173`

---

## ☁️ Deployment

### Backend → HuggingFace Spaces (Free)

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. Choose **Docker** as the SDK
3. Push the `backend/` folder contents to the Space repo:
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/humanizer-backend
cp -r backend/* humanizer-backend/
cd humanizer-backend
git add . && git commit -m "Deploy backend" && git push
```
4. In the Space settings, add a **Secret**:
   - Key: `HF_TOKEN`
   - Value: your HuggingFace token

Your backend URL will be:
`https://YOUR_USERNAME-humanizer-backend.hf.space`

### Frontend → GitHub Pages (Free)

1. Push the entire repo to GitHub
2. In your GitHub repo → **Settings → Pages → Source**: set to `GitHub Actions`
3. Add a **Repository Secret**:
   - Go to Settings → Secrets → Actions
   - Name: `VITE_API_URL`
   - Value: `https://YOUR_USERNAME-humanizer-backend.hf.space`
4. Push to `main` — GitHub Actions will auto-build and deploy!

Your frontend URL will be:
`https://YOUR_USERNAME.github.io/humanizer-app`

---

## 🔑 Getting a HuggingFace Token

1. Sign up at [huggingface.co](https://huggingface.co)
2. Go to **Settings → Access Tokens**
3. Click **New Token** → choose **Read** role
4. Copy the token — use it as `HF_TOKEN`

> The free tier allows ~1000 inference requests/day. More than enough for personal use.

---

## 🧠 How It Works

```
User Input
    │
    ▼
React Frontend  ──POST /humanize──►  FastAPI Backend
                                          │
                                          ▼
                                   Mistral 7B Instruct
                                   (via HuggingFace API)
                                          │
                                          ▼
                                   Humanized Text
                ◄────────────────────────┘
```

The backend sends the input text to Mistral 7B with a carefully crafted prompt that instructs the model to:
- Vary sentence length and structure
- Use natural contractions
- Remove AI giveaway phrases ("delve", "crucial", "it's worth noting")
- Match the selected tone (Auto / Casual / Formal / Academic)

---

## 📡 API Reference

### `POST /humanize`
```json
// Request
{
  "text": "It is crucial to delve into this topic...",
  "tone": "casual"   // "default" | "casual" | "formal" | "academic"
}

// Response
{
  "result": "Let's dig into this...",
  "original_word_count": 42,
  "result_word_count": 39,
  "tone": "casual",
  "processing_time_ms": 1240
}
```

### `GET /health`
```json
{ "status": "healthy" }
```

---

## 🛠️ Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `HF_TOKEN` | Backend `.env` | HuggingFace API token |
| `VITE_API_URL` | Frontend `.env` | Backend API base URL |

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

## 🙏 Built With

- [Mistral 7B Instruct](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3) — Open source LLM by Mistral AI
- [FastAPI](https://fastapi.tiangolo.com/) — Python web framework
- [React](https://react.dev/) — Frontend UI library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [HuggingFace](https://huggingface.co/) — Model hosting & inference
- [GitHub Pages](https://pages.github.com/) — Frontend hosting
