LLMetry Frontend

A React and TypeScript dashboard for monitoring LLM provider usage covering multi-provider management, a chat interface, and observability analytics.

Live demo: https://llmetry-frontend-1.onrender.com/login

Demo credentials: demo@llmetry.com and demo@123

Note: The backend is on Render's free tier and may take around 30 seconds on the first request due to cold start.


Tech Stack

React 19, Vite 8, TypeScript, React Router v7, Axios, Recharts, CSS Modules


Features

Authentication with JWT-based login and sign-up.

Provider Management to browse the LLM provider catalog and register API keys.

Model Management to list and add models per provider with a default model option.

Chat Interface with multi-session support, provider and model selection, and markdown rendering.

Analytics Dashboard with date-range and provider filters showing request metrics, throughput, latency, comparisons, and error logs.


Routes

/login is public and handles login and sign-up.

/chat, /providers, /analytics, and /profile are all protected and require a valid JWT.

Unauthenticated users are redirected to /login.


Running Locally

Prerequisites: Node.js 18 or higher.

Install dependencies with npm install, then start the dev server with npm run dev.

The app will be available at http://localhost:5173.

Set the environment variable VITE_API_BASE_URL to your backend URL before building, for example http://localhost:5000.


Running With Docker

Prerequisites: Docker and Docker Compose.

Run docker compose up --build to build and start the app.

To pass the API URL inline, run VITE_API_BASE_URL=https://api.example.com docker compose up --build.

The app will be available at http://localhost:5173.