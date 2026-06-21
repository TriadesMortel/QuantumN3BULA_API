"""Agent endpoints."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.agent import Agent
from app.models.user import User
from app.schemas.agent import AgentCreate, AgentResponse

router = APIRouter()


@router.get("", response_model=list[AgentResponse])
async def list_agents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all agents."""
    agents = db.query(Agent).offset(skip).limit(limit).all()
    return agents


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific agent by ID."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )
    return agent


@router.post("", response_model=AgentResponse)
async def create_agent(
    agent_data: AgentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new agent."""
    # Check if agent name exists
    if db.query(Agent).filter(Agent.name == agent_data.name).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent name already exists",
        )

    agent = Agent(
        name=agent_data.name,
        description=agent_data.description,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@router.post("/{agent_id}/heartbeat", response_model=AgentResponse)
async def agent_heartbeat(
    agent_id: int,
    db: Session = Depends(get_db),
):
    """Update agent heartbeat."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )

    agent.last_heartbeat = datetime.now(timezone.utc)
    agent.status = "active"
    db.commit()
    db.refresh(agent)
    return agent


@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an agent."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )

    db.delete(agent)
    db.commit()
    return {"message": "Agent deleted successfully"}
