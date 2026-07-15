"""B3 User Account Management — profile fields, preferences, privacy

Extends ``users`` with extended profile fields and soft-delete support, and
introduces two new 1:1 tables for the Account Management module (Phase B3):
  - user_preferences      : theme + per-channel notification toggles
  - user_privacy_settings : profile visibility + search discoverability

Revision ID: b3_user_profile_0002
Revises: b2_identity_0001
Create Date: 2026-07-15
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "b3_user_profile_0002"
down_revision = "b2_identity_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ─── Extend users ──────────────────────────────────────────────────────────
    op.add_column("users", sa.Column("bio", sa.Text(), nullable=True))
    op.add_column("users", sa.Column("date_of_birth", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("gender", sa.String(length=32), nullable=True))
    op.add_column("users", sa.Column("country", sa.String(length=100), nullable=True))
    op.add_column("users", sa.Column("city", sa.String(length=100), nullable=True))
    op.add_column(
        "users",
        sa.Column("timezone", sa.String(length=64), nullable=False, server_default="UTC"),
    )
    op.add_column(
        "users",
        sa.Column("language", sa.String(length=10), nullable=False, server_default="en"),
    )
    op.add_column(
        "users",
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column(
        "users", sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True)
    )

    # ─── user_preferences ──────────────────────────────────────────────────────
    op.create_table(
        "user_preferences",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("theme", sa.String(length=16), nullable=False),
        sa.Column("email_notifications", sa.Boolean(), nullable=False),
        sa.Column("push_notifications", sa.Boolean(), nullable=False),
        sa.Column("marketing_emails", sa.Boolean(), nullable=False),
        sa.Column("ai_notifications", sa.Boolean(), nullable=False),
        sa.Column("community_notifications", sa.Boolean(), nullable=False),
        sa.Column("order_notifications", sa.Boolean(), nullable=False),
        sa.Column("health_notifications", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_user_preferences_user_id", "user_preferences", ["user_id"], unique=True
    )

    # ─── user_privacy_settings ─────────────────────────────────────────────────
    op.create_table(
        "user_privacy_settings",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("profile_visibility", sa.String(length=16), nullable=False),
        sa.Column("search_visibility", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_user_privacy_settings_user_id",
        "user_privacy_settings",
        ["user_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_table("user_privacy_settings")
    op.drop_table("user_preferences")

    op.drop_column("users", "deleted_at")
    op.drop_column("users", "is_deleted")
    op.drop_column("users", "language")
    op.drop_column("users", "timezone")
    op.drop_column("users", "city")
    op.drop_column("users", "country")
    op.drop_column("users", "gender")
    op.drop_column("users", "date_of_birth")
    op.drop_column("users", "bio")
