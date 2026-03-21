# 🤰 Maternal Care Assistant
### AI-Powered Prenatal Monitoring & Support System

Maternal Care Assistant is a comprehensive full-stack platform designed to empower expecting mothers. It combines secure health tracking, interactive data visualization, and a context-aware AI assistant to provide personalized guidance and critical symptom triage.

---

## ✨ Key Features

- **🤖 Context-Aware AI Assistant**: A GPT-4o powered chatbot that knows your pregnancy timeline and recent vitals to provide tailored advice and medical triage.
- **📈 Health Data Visualization**: Interactive trend charts for Blood Pressure and Weight tracking using Recharts.
- **🛡️ Secure Patient Portal**: JWT-based authentication with a secure MySQL backend.
- **🩺 Visual Appointment Scheduling**: Choose your preferred doctor from a professional medical team, complete with portraits and contact details.
- **🚨 Intelligent Risk Alerts**: Automatic identification of "Red Flag" symptoms and vital sign anomalies.
- **👤 Profile Management**: Keep your pregnancy details and emergency contacts up to date.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Premium "Maternal" theme)
- **Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Server**: Node.js & Express
- **Database**: MySQL (TypeORM)
- **AI**: OpenAI GPT-4o
- **Security**: JWT, BcryptJS, Express Validator

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server
- OpenAI API Key

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_NAME=maternal_health
   DATABASE_USER=your_user
   DATABASE_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_openai_key
   ```
4. Run migrations: `npm run migration:run`
5. Start server: `npm run dev`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. Start dev server: `npm run dev`

---

## 📡 API Overview (v1)

| Route | Method | Description |
|-------|--------|-------------|
| `/users/register` | POST | Patient registration |
| `/users/login` | POST | Patient login |
| `/users/profile` | GET/PUT | Manage health profile |
| `/vitals` | GET/POST | Log and track vital signs |
| `/appointments` | GET/POST/DELETE | Schedule medical visits |
| `/chat/message` | POST | Consult the AI Assistant |

---

## ⚠️ Disclaimer
This application is for **informational purposes only** and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.

---
*Created with ❤️ for Maternal Wellness.*
