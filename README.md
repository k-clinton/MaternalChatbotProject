# Maternal Health Monitoring Chatbot

A comprehensive full-stack application for maternal health monitoring, designed to assist expecting mothers with symptom triage, vitals tracking, and pregnancy guidance using conversational AI.

## 🌟 Features

- **Conversational AI Assistant:** Triage symptoms, log health information, and get general pregnancy advice powered by OpenAI's GPT-4o model.
- **Urgency Detection:** The chatbot automatically identifies severe symptoms and flags them as urgent medical alerts.
- **Vitals & Pregnancy Tracker:** Monitor weekly progress, fetal development, and log daily vitals.
- **Risk Assessment System:** Intelligent alerts for potential maternal health risks based on tracked data and symptoms.
- **Upcoming Appointments:** Manage and view upcoming OB/GYN checkups.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, TypeScript, React Router, Lucide React, Axios
- **Backend:** Node.js, Express, TypeScript, TypeORM, SQLite, OpenAI API
- **AI Integration:** OpenAI API (GPT-4o)
- **Security:** Helmet, Rate Limiting, CORS

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- OpenAI API key or GitHub Marketplace Models Key

### 1. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. The `.env` file is already configured for development with SQLite database.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 📡 API Endpoints

### Chat
- `POST /api/v1/chat/message` - Send a message to the AI assistant

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

### Vitals
- `POST /api/v1/vitals/log` - Log vitals (blood pressure, weight, fetal movement)
- `GET /api/v1/vitals` - Get vitals history
- `GET /api/v1/vitals/alerts` - Get risk alerts

### Appointments
- `POST /api/v1/appointments` - Schedule an appointment
- `GET /api/v1/appointments` - Get upcoming appointments

## 🔧 Development

### Running Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Building for Production
```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
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
