# AI Resume Analyzer

An AI-powered resume analyzer built with React Router v7, TailwindCSS, and Google Gemini AI. Upload your PDF resume and a job description to get an ATS score, detailed feedback, skill gap analysis, and actionable suggestions.

## 🚀 Live Demo

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/CodewithMayur-dev/ai-resume-analyzer)

> **Deploy your own live instance** by clicking the button above (free tier available on Render.com) — or see [Deployment](#deployment) below for more options.

## Features

- 📄 **PDF Upload** – Drag & drop or click to upload your resume
- 🤖 **AI Analysis** – Powered by Google Gemini AI
- 📊 **ATS Score** – Get a score out of 100
- 💪 **Strengths & Weaknesses** – Detailed per-section feedback
- 🎯 **Skill Gap Analysis** – See matching and missing skills
- 💡 **Actionable Suggestions** – Concrete steps to improve
- 💾 **Local Storage** – All analyses saved in your browser

## Getting Started

### Prerequisites

- Node.js 20+
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Usage

1. Visit the app and click **Analyze My Resume**
2. Enter your Gemini API key (saved locally – never sent to any server except Google)
3. Upload your PDF resume
4. Paste the job description
5. Click **Analyze Resume** and wait for AI analysis
6. View your ATS score, strengths, weaknesses, skill gaps, and suggestions

## Building for Production

```bash
npm run build
npm run start
```

## Docker

```bash
docker build -t ai-resume-analyzer .
docker run -p 3000:3000 ai-resume-analyzer
```

## Deployment

The app is packaged as a Docker image, making it deployable on any container-friendly platform:

| Platform | Steps |
|---|---|
| **Render** | Connect your GitHub repo in the [Render dashboard](https://dashboard.render.com/) → New Web Service → select this repo → Render auto-detects `render.yaml` |
| **Railway** | [railway.app](https://railway.app/) → New Project → Deploy from GitHub repo → Railway auto-detects the `Dockerfile` |
| **Fly.io** | `fly launch` then `fly deploy` (auto-detects `Dockerfile`) |
| **Docker / Self-hosted** | `docker build -t ai-resume-analyzer . && docker run -p 3000:3000 ai-resume-analyzer` |

After deployment, Render/Railway/Fly.io will provide a **live HTTPS URL** for your app.

## Tech Stack

- [React Router v7](https://reactrouter.com/) – Full-stack React framework
- [TailwindCSS v4](https://tailwindcss.com/) – Styling
- [PDF.js](https://mozilla.github.io/pdf.js/) – PDF text extraction
- [Zustand](https://zustand-demo.pmnd.rs/) – State management
- [Google Gemini AI](https://ai.google.dev/) – AI analysis

---

Built with ❤️ using React Router.

