from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Quantum-N3BULA API", version="1.0.0")

ALLOWED_COMMANDS = {"status", "sync", "ping", "logs", "health"}


class ExecuteRequest(BaseModel):
    command: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-zA-Z0-9_\-]+$")


@app.get("/ping")
def ping():
    return {"status": "OK"}

@app.get("/status")
def status():
    return {
        "vps": "Active",
        "bot": "Deep_N3BULA",
        "driveSync": "Stable",
        "cortexState": "Operational"
    }

@app.post("/execute")
def execute(request: ExecuteRequest):
    if request.command not in ALLOWED_COMMANDS:
        raise HTTPException(
            status_code=400,
            detail=f"Command '{request.command}' is not allowed. "
                   f"Allowed commands: {', '.join(sorted(ALLOWED_COMMANDS))}",
        )
    return {"result": f"Executed: {request.command}"}

@app.get("/logs")
def logs():
    return {"logs": ["System stable.", "Fractal sync OK.", "No critical events."]}
