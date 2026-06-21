"""Initial migration - create all tables

Revision ID: 001_initial
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_admin', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create agents table
    op.create_table(
        'agents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('last_heartbeat', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_agents_id'), 'agents', ['id'], unique=False)

    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('command', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('result', sa.Text(), nullable=True),
        sa.Column('error', sa.Text(), nullable=True),
        sa.Column('agent_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tasks_id'), 'tasks', ['id'], unique=False)

    # Create logs table
    op.create_table(
        'logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('level', sa.String(length=20), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('source', sa.String(length=100), nullable=True),
        sa.Column('task_id', sa.Integer(), nullable=True),
        sa.Column('agent_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_logs_id'), 'logs', ['id'], unique=False)

    # Create events table
    op.create_table(
        'events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('payload', sa.JSON(), nullable=True),
        sa.Column('source', sa.String(length=100), nullable=True),
        sa.Column('task_id', sa.Integer(), nullable=True),
        sa.Column('agent_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_events_id'), 'events', ['id'], unique=False)
    op.create_index(op.f('ix_events_event_type'), 'events', ['event_type'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_events_event_type'), table_name='events')
    op.drop_index(op.f('ix_events_id'), table_name='events')
    op.drop_table('events')
    op.drop_index(op.f('ix_logs_id'), table_name='logs')
    op.drop_table('logs')
    op.drop_index(op.f('ix_tasks_id'), table_name='tasks')
    op.drop_table('tasks')
    op.drop_index(op.f('ix_agents_id'), table_name='agents')
    op.drop_table('agents')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
