# 🚀 Quantum-N3BULA Mono-Repo

**Structure** :

```
/core       # Backend (FastAPI)
/agents     # Bots (n8n, Mistral)
/infra      # Azure/Cloudflare
```

## Getting Started

### Core API

```bash
cd core
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080
```

### Docker

```bash
cd core
docker build -t quantum-n3bula-api .
docker run -p 8080:8080 quantum-n3bula-api
```

## Endpoints

| Method | Path       | Description          |
|--------|------------|----------------------|
| GET    | `/ping`    | Health check         |
| GET    | `/status`  | System status        |
| POST   | `/execute` | Execute a command    |
| GET    | `/logs`    | Retrieve system logs |
