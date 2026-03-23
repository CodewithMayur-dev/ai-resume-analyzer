# AI Resume Analyzer

An AI-powered resume analyzer built with React Router v7, TailwindCSS, and Google Gemini AI. Upload your PDF resume and a job description to get an ATS score, detailed feedback, skill gap analysis, and actionable suggestions.

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

## Tech Stack

- [React Router v7](https://reactrouter.com/) – Full-stack React framework
- [TailwindCSS v4](https://tailwindcss.com/) – Styling
- [PDF.js](https://mozilla.github.io/pdf.js/) – PDF text extraction
- [Zustand](https://zustand-demo.pmnd.rs/) – State management
- [Google Gemini AI](https://ai.google.dev/) – AI analysis

---

Built with ❤️ using React Router.

