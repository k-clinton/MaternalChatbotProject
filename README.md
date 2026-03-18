# Maternal Health Monitoring Chatbot

A comprehensive full-stack application for maternal health monitoring, designed to assist expecting mothers with symptom triage, vitals tracking, and pregnancy guidance using conversational AI.

![MaternalCare Dashboard Placeholder]() <!-- Add screenshots here -->

## 🌟 Features

- **Conversational AI Assistant:** Triage symptoms, log health information, and get general pregnancy advice powered by OpenAI's GPT-4o model.
- **Urgency Detection:** The chatbot automatically identifies severe symptoms and flags them as urgent medical alerts.
- **Vitals & Pregnancy Tracker:** Monitor weekly progress, fetal development, and log daily vitals.
- **Risk Assessment System:** Intelligent alerts for potential maternal health risks based on tracked data and symptoms.
- **Upcoming Appointments:** Manage and view upcoming OB/GYN checkups.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, TypeScript, React Router, Lucide React
- **Backend:** Node.js, Express, TypeScript, TypeORM, Postgres, Zod (validation)
- **AI Integration:** OpenAI API (GPT-4o)
- **Authentication/Security:** JWT, bcryptjs, Helmet, Rate Limiting

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (or SQLite via TypeORM config interchangeably)
- Redis server running locally (optional but recommended for rate limiting and caching)
- An OpenAI API key or GitHub Marketplace Models Key.

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=6000
   API_PREFIX=/api/v1
   
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=maternal_health
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   
   OPENAI_API_KEY=your_openai_or_github_pat_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory connecting to the backend API:
   ```env
   VITE_API_URL=http://localhost:6000/api/v1
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

## 📜 API Endpoints Summary

- **POST `/api/v1/chat/message`**: Send a message to the AI and receive a medical triage reply.
- **GET `/api/v1/vitals`**, **POST `/api/v1/vitals`**: Read and record patient vitals.
- **GET `/api/v1/appointments`**: Manage upcoming patient appointments.
- **POST `/api/v1/users/register`**, **POST `/api/v1/users/login`**: Patient authentication.

## ⚠️ Disclaimer
The AI assistant provides general information and is not a substitute for professional medical advice. Always consult with a healthcare professional for serious or concerning symptoms.
