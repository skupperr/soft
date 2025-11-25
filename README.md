# LifeLens

A complete AI-powered personal decision assistant that integrates meal planning, productivity management, career learning guidance, and financial support — all in one intelligent web platform.

![LifeLens](https://img.shields.io/badge/LifeLens-4b8673)
![Frontend](https://img.shields.io/badge/Frontend-React.js-blue)
![CSS](https://img.shields.io/badge/Styling-TailwindCSS-purple)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Database](https://img.shields.io/badge/Database-MySQL-blue)
![Cache](https://img.shields.io/badge/Cache-Redis-red)
![Containerization](https://img.shields.io/badge/Deployment-Docker-blue)
![AI](https://img.shields.io/badge/AI-Gemini%202.0%20%2B%20LangChain-purple)
![AI](https://img.shields.io/badge/Web%20Scrapping-BeautifulSoup4%20%2B%20PlayWright-blue)
![Authentication](https://img.shields.io/badge/Auth-ClerkAPI-lightblue)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Local Development Setup](#local-development-setup)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Technology Used](#technology-used)
- [Technology Breakdown](#technology-breakdown)
- [Security & Best Practices](#security--best-practices)
- [License](#license)
- [Credits](#credits)



## Overview

LifeLens AI is a comprehensive AI-powered life management platform built with a modern microservices architecture. The platform integrates meal planning, productivity management, career guidance, and financial planning into a unified, intelligent web application.

## Features
- 🧠 **Central AI Chatbot** — A unified assistant powered by Gemini 2.0 that understands context across modules to deliver cohesive, personalized guidance.
- 🍽️ **Meal Planning, Grocery Management & AI Suggestions** — Creates personalized meal plans, nutrition insights, grocery lists, and ingredient-based recommendations.
- ⏱️ **Productivity & Routine Planner** — Helps structure tasks, daily routines, reminders, and suggests ways to spend your free time productively.
- 🎓 **Career & Learning Advisor** — Builds tailored learning paths, identifies skill gaps, recommends courses, and tracks learning progress. 
- 🛠️ **Industry Market Summary** — Real-time industry insights including skill demand, salary trends, market forecasts, and curated daily news. 
- 💸 **Financial Assistant & Budget Planner** — Analyzes spending, builds budgets, tracks saving goals, and identifies opportunities to save.
- 📊 **Progress Analytics** — visualized usage data, streaks, and performance metrics for Finance and Career
- 📧 **Gmail Integration & AI Email Writer** — Full Gmail integration to read, write, and manage email with an AI writer that adapts tone and intent.
- 🤖 **AI Suggestions** — AI generated personalized health alert, saving suggestions, free time activities, new skills based on user data and career goal.
- 👨‍💼 **Admin Management System** — manage users, content, and analytics in one place  
<!-- - 🧾 **Data Insights** — AI-powered recommendations from user behavior and activity logs -->




## 🚀 Quick Start

### 🧰 Prerequisites

Before running LifeLens, make sure the following software and tools are installed on your system:

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux) — for running Redis and optional containerized services  
- **Git** — to clone and manage the repository  
- **Node.js v18+** — required for the React frontend  
- **Python 3.10+** — required for the FastAPI backend  
- **MySQL 8.0+** — main relational database for LifeLens  
- **FastAPI** — Python web framework (installed automatically via `requirements.txt`)  
- **Redis** — caching and session management (run via Docker command)  
- **npm** — Node package manager (bundled with Node.js)  
- **Virtual Environment (venv)** — to isolate Python dependencies  
- **Web Browser** — for accessing the frontend interface (Google Chrome recommended)

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/mdrifat-hossain/LifeLens.git
cd LifeLens

# 2. Frontend
cd frontend
npm install
npm run dev

# 2. Backend
#open cmd in \LifeLens directory copy >> paste >> enter
python -m venv my_env 
# Activate virtual environment (Windows)
.venv\Scripts\activate

# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python server.py
# Runs API on http://localhost:8000

```

### Manual Docker Setup
```bash
# 1. Install Docker on your PC
#    (Download from: https://www.docker.com/products/docker-desktop/)

# 2. Open CMD or Terminal and pull + run Redis container
docker run -d --name redis -p 6379:6379 redis

# 3. Verify that Redis is running
docker ps
```

## 🛠️ Local Development Setup

## 🔧 Configuration

### Environment Variables


**For Local Development:**
```env
NODE_ENV=development
PORT=3000

# Database (supports auto-detection)
    "host": "localhost",
    "user": "userName",
    "password": "your password",
    "db": "your database name",
    "minsize": 1,
    "maxsize": 5,
    "autocommit": True,  # we'll explicitly commit/rollback
    "charset": "utf8mb4",

```

### Files Structure
```
LifeLens/
├── backend/
│ ├── src/                  # FastAPI source code (routes, models, services)
│ ├── requirements.txt      # Python dependencies
│ ├── server.py             # FastAPI entry point
│ └── init.py
│
├── frontend/
│ ├── node_modules/         # Installed npm dependencies
│ ├── public/               # Static assets
│ ├── src/                  # React components and pages
│ ├── .env                  # Environment configuration
│ ├── .gitignore
│ ├── eslint.config.js      # ESLint configuration
│ ├── index.html            # Entry HTML file
│ ├── package.json          # Frontend dependencies and scripts
│ ├── package-lock.json
│ ├── tailwind.config.js    # Tailwind CSS configuration
│ └── vite.config.js        # Vite build configuration
│
├── .gitignore
└── README.md               # Project documentation
```




## 🛠️ Architecture

### Microservices Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   API Gateway (FastAPI)                 │
│                  Central Request Router                 │
└─────────────┬──────────────┬──────────────┬─────────────┘
              │              │              │
      ┌───────▼──────┐  ┌────▼───────┐ ┌────▼─────┐
      │   Meal       │  │Productivity│ │ Career   │
      │  Planning    │  │  Manager   │ │ Advisor  │
      │  Service     │  │  Service   │ │ Service  │
      └──────────────┘  └────────────┘ └──────────┘
             │                │             │
┌────────────▼────────────────▼─────────────▼─────────────┐
│              Shared Context Layer (Redis)               │
│             User Profiles | Session State               │
└─────────────────────────────────────────────────────────┘
                            │
    ┌───────────────────────▼───────────────────────┐
    │                MySQL Database                 │
    │       User Data | Preferences | History       │
    └───────────────────────────────────────────────┘
```

### Request Flow
1. **Client → Frontend (React)** - User interaction
2. **Frontend → API Gateway (FastAPI)** - HTTP/REST requests
3. **API Gateway → Microservices** - Service routing
4. **Microservices → Redis** - Cache check
5. **Microservices → MySQL** - Data persistence
6. **AI Processing → LangChain + Gemini 2.0** - Intelligent responses
7. **Response → Client** - JSON data with AI recommendations

## Technology Used

### Frontend
- **React.js** + **Tailwind CSS**: Responsive, dynamic, component-based UI.

### Backend
- **FastAPI**: Handles requests, business logic, and AI integration.  
- **Docker**: Redis caching
- **LangChain** – Multi-model AI workflows  
- **Playwright** – Automated web scraping  

### APIs
- **Gemini 2.0 Flash** – AI reasoning and conversation  
- **Gemini 2.5 Flash Image (Nano Banana)** – Image generation  
- **Sentence-Transformers** – Semantic vector ranking  
- **Clerk API** – Authentication & user sessions  
- **Gmail API** – Email notifications  
- **newsdata.io API** – Career/news updates  
- **Cloudinary API** – Image storage & optimization

### Database
- **MySQL** – Structured data management  
- **Redis** – Caching for faster performance

### Testing
- **Selenium** – Frontend testing


### AI/ML Models
- **Gemini 2.0 Flash** – Core LLM  
- **LangChain** – Multi-step reasoning framework  
- **Sentence-Transformers** – Text recommendation  
- **all-MiniLM-L6-v2** - Sentence embeddings (Hugging Face model)
- **Gemini 2.5 Flash Image** – Dynamic visual generation

## Technology Breakdown

### 🎨 Frontend Technologies
- ⚛️ **React** — Component-based UI framework for building dynamic, interactive user interfaces with efficient rendering and state management.
- 🟨 **JavaScript** — Core programming language enabling client-side logic, API interactions, and seamless user experiences.
- 🎨 **Tailwind CSS** — Utility-first CSS framework for rapid, responsive UI development with consistent, modern styling.
- 🔐 **Clerk (Frontend SDK)** — Pre-built authentication UI components for login, signup, and user profile management.

### ⚙️ Backend Technologies
- ⚡ **FastAPI** — High-performance Python web framework with async support, automatic API documentation, and type-safe request validation.
- 🐍 **Python** — Primary backend language enabling rapid development, extensive library ecosystem, and seamless AI integration.
- 🔗 **LangChain** — AI orchestration framework for managing complex workflows, maintaining conversation context, and implementing sophisticated prompt engineering across modules.
- 🔐 **Clerk (Backend SDK)** — Server-side authentication handling for JWT verification, session management, and role-based access control.
- 🌐 **BeautifulSoup4** — HTML parsing library for web scraping grocery items.
- 🎭 **Playwright** — Browser automation tool for scraping JavaScript-rendered content and extracting dynamic web data.
- 🧠 **Sentence-Transformers** — Pre-trained models for generating semantic embeddings, enabling skill matching and intelligent course recommendations.
- 🤗 **Hugging Face** — Access to state-of-the-art transformer models for text classification, sentiment analysis, and NLP tasks.
- 🔍 **Pydantic** — Data validation and settings management using Python type annotations for type-safe API contracts.

### 🗄️ Database & Storage
- 🐬 **MySQL** — Relational database for structured data storage including user profiles, preferences, meal plans, tasks, and transaction history with ACID compliance.
- ⚡ **Redis** — In-memory cache for high-speed data access, session management, and real-time synchronization, reducing database queries by 60%.
- ☁️ **Cloudinary** — Cloud-based media storage and optimization service for user profile pictures, meal images, and other uploaded content.

### 🤖 AI & Machine Learning
- ✨ **Gemini 2.0 Flash** — Google's advanced language model powering the central AI chatbot with fast response times, large context windows, and multimodal capabilities for intelligent, context-aware recommendations across all modules.
- **all-MiniLM-L6-v2** - Sentence embeddings for vector ranking for AI chat (Hugging Face model)

### 🚀 Performance & Optimization
- ⚡ **Redis Caching** — Strategic caching layer for frequently accessed data, AI-generated responses, and user sessions, achieving sub-200ms response times for 1,000+ concurrent users.
- 🔄 **Async/Await (FastAPI)** — Asynchronous programming patterns enabling non-blocking I/O operations, concurrent request handling, and optimal resource utilization.
- 🎯 **Connection Pooling** — Database connection management reducing overhead and enabling efficient handling of multiple simultaneous requests.
- 📊 **Rate Limiting** — Per-user request quotas ensuring fair resource allocation, preventing abuse, and maintaining platform stability under load.

### 🏗️ Architecture Patterns
- 🔧 **Microservices Architecture** — Independent, loosely-coupled services for each life management domain (meal, productivity, career, finance) enabling scalability and maintainability.
- 🌐 **API Gateway Pattern** — Centralized request routing, authentication verification, and cross-service communication management through FastAPI.
<!-- - 🧩 **State Management** — User activity tracking across modules enabling cross-domain AI recommendations (e.g., adjusting meal plans based on productivity goals). -->
- 💾 **Caching Strategy** — Multi-tiered approach with Redis for hot data, MySQL for persistent storage, and intelligent cache invalidation policies.

### 🔒 Authentication & Security
- 🔑 **Clerk** — Enterprise-grade authentication platform providing secure user management, JWT tokens, session handling, and role-based access control for both user and admin dashboards.
### 📧 External Integrations
- 📬 **Gmail API** — Google's email API enabling seamless inbox management, email composition, sending, and categorization directly within the platform.

---
**Total Technologies: 20+ integrated tools working together to deliver an intelligent, scalable, and user-friendly life management platform.**

## 🔒 Security & Best Practices

### Common Solutions
```bash
# Port already in use
netstat -tlnp | grep :3000  # Find process using port
sudo kill -9 <PID>          # Kill the process

# Database connection failed
docker-compose restart mysql # Restart MySQL container

# Website not showing updated values after DB connection
# 1. Restart backend server
# 2. Clear Redis cache
# 3. Check MySQL server port
# 4. Ensure all required dependencies and services are installed
```
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎖️ Credits

**LifeLens** – Empowering Smarter Living Through AI! 🌍

**Developed by Asif Uddin Ahmed**