# Quantum-N3BULA 🚀

A modular AI-ops platform built with **FastAPI** (Python backend) and **Next.js** (TypeScript frontend).

![Python](https://img.shields.io/badge/Python-3.12+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## ✨ Features

### Backend (FastAPI)
- **REST API Endpoints**: `/ping`, `/status`, `/execute`, `/logs`, `/agents`
- **WebSocket Support**: Real-time updates from agents
- **JWT Authentication**: Secure user authentication system
- **SQLite + SQLAlchemy ORM**: Lightweight database with migrations via Alembic
- **Async Architecture**: Fully asynchronous request handling
- **Logging Middleware**: Structured request/response logging

### Frontend (Next.js)
- **Dashboard**: System status, logs stream, and task executor UI
- **Pages**: Overview, Logs, Agents, Settings
- **TailwindCSS**: Modern, responsive styling with custom Nebula theme
- **Zustand**: Lightweight state management
- **WebSocket Hook**: Real-time connection to backend

### CI/CD
- **GitHub Actions**: Automated lint, test, and Docker build/push pipeline
- **Docker Compose**: One-command deployment for all services

## 📁 Project Structure

```
quantum-n3bula/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   │   └── endpoints/ # Individual endpoint modules
│   │   ├── core/          # Config, database, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── utils/         # Utilities (WebSocket, middleware)
│   │   └── main.py        # Application entry point
│   ├── alembic/           # Database migrations
│   ├── tests/             # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # API client and Zustand store
│   ├── pages/             # Next.js pages
│   ├── styles/            # Global CSS with TailwindCSS
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── .github/workflows/     # CI/CD pipeline
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/quantum-n3bula.git
cd quantum-n3bula

# Start all services
docker-compose up -d

# Access the applications:
# - Frontend: http://localhost:3000
# - Backend API: http://127.0.0.1:18080
# - API Docs: http://127.0.0.1:18080/docs
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./quantum_nebula.db` | Database connection string |
| `SECRET_KEY` | `quantum-nebula-secret-key...` | JWT secret key (change in production!) |
| `DEBUG` | `false` | Enable debug mode |

### Frontend Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:18080` | Backend API URL |
| `NEXT_PUBLIC_WS_URL` | `ws://127.0.0.1:18080/ws` | WebSocket URL |

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ping` | Health check | ❌ |
| GET | `/api/status` | System status | ❌ |
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/token` | Login (get JWT) | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/tasks` | List all tasks | ❌ |
| POST | `/api/tasks` | Create new task | ✅ |
| POST | `/api/tasks/execute` | Execute command | ✅ |
| GET | `/api/agents` | List all agents | ❌ |
| POST | `/api/agents` | Create new agent | ✅ |
| GET | `/api/logs` | List all logs | ❌ |
| WS | `/ws` | WebSocket for live updates | ❌ |

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Lint
```bash
cd frontend
npm run lint
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

## 🔐 Security Notes

⚠️ **Before deploying to production:**
1. Change the `SECRET_KEY` environment variable to a secure random value
2. Use HTTPS in production
3. Configure proper CORS origins
4. Use a production-grade database (PostgreSQL recommended)

## 📝 License

MIT License - feel free to use this project for your own AI-ops needs!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using FastAPI + Next.js