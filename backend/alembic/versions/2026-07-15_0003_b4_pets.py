"""B4 Pet Management — pets, pet_gallery_images

Initial schema for the Pet Management module (Phase B4). ``pets`` becomes the
core domain entity every future module (Health, Appointments, AI, Orders,
Community, Notifications) references via ``pet_id`` — none of those tables
are created here, only the foundation they will point at.

Creates:
  - pets                : owner-scoped pet profiles (soft-deletable)
  - pet_gallery_images  : additional photos beyond profile/cover image

Revision ID: b4_pets_0003
Revises: b3_user_profile_0002
Create Date: 2026-07-15
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "b4_pets_0003"
down_revision = "b3_user_profile_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ─── pets ───────────────────────────────────────────────────────────────────
    op.create_table(
        "pets",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("owner_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("species", sa.String(length=32), nullable=False),
        sa.Column("breed", sa.String(length=100), nullable=True),
        sa.Column("gender", sa.String(length=16), nullable=True),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("weight", sa.Numeric(precision=6, scale=2), nullable=True),
        sa.Column("height", sa.Numeric(precision=6, scale=2), nullable=True),
        sa.Column("color", sa.String(length=100), nullable=True),
        sa.Column("microchip_number", sa.String(length=50), nullable=True),
        sa.Column("sterilized", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("blood_group", sa.String(length=20), nullable=True),
        sa.Column("profile_image", sa.String(length=512), nullable=True),
        sa.Column("cover_image", sa.String(length=512), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "status", sa.String(length=16), nullable=False, server_default="ACTIVE"
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column(
            "is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("microchip_number", name="uq_pets_microchip_number"),
    )
    op.create_index("ix_pets_owner_id", "pets", ["owner_id"])
    op.create_index("ix_pets_species", "pets", ["species"])
    op.create_index("ix_pets_status", "pets", ["status"])

    # ─── pet_gallery_images ─────────────────────────────────────────────────────
    op.create_table(
        "pet_gallery_images",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("pet_id", sa.String(length=36), nullable=False),
        sa.Column("image_url", sa.String(length=512), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["pet_id"], ["pets.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_pet_gallery_images_pet_id", "pet_gallery_images", ["pet_id"]
    )


def downgrade() -> None:
    op.drop_table("pet_gallery_images")
    op.drop_table("pets")
