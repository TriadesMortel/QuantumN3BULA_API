# QuantumN3BULA_API — Local ports

- Frontend (Next.js): http://127.0.0.1:13000
- Backend (FastAPI):  http://127.0.0.1:18080/docs
- Postgres (local):   127.0.0.1:15432  (container 5432)
- Redis (local):      127.0.0.1:6380   (container 6379)

Note: port 3000 peut être occupé par colima/ssh mux sur macOS.

## Automated local smoke

Run the complete local smoke from the repository root:

```bash
bash scripts/local_smoke.sh
```

The smoke runs backend tests, builds the frontend, starts the API on
`127.0.0.1:8001`, and validates `/`, `/api/health`, and `/openapi.json`.

The canonical health endpoint is `/api/health`. `/health` is not canonical.
