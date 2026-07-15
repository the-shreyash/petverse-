"""
app/modules/dashboard/schemas/dashboard.py
"""

from typing import Any
from pydantic import BaseModel, Field
from app.core.schema import PetVerseBaseModel


class DashboardStats(PetVerseBaseModel):
    total_pets: int
    healthy_pets: int
    appointments_this_week: int
    vaccinations_due: int
    average_health_score: int


class ChartData(PetVerseBaseModel):
    label: str
    value: Any


class DashboardCharts(PetVerseBaseModel):
    weight_trend: list[ChartData] = Field(default_factory=list)
    vaccination_status: list[ChartData] = Field(default_factory=list)
    health_score_trend: list[ChartData] = Field(default_factory=list)
    monthly_visits: list[ChartData] = Field(default_factory=list)


class DashboardResponse(PetVerseBaseModel):
    stats: DashboardStats
    pets: list[dict[str, Any]]
    health_summary: dict[str, Any] = Field(default_factory=dict)
    vaccinations: list[dict[str, Any]] = Field(default_factory=list)
    appointments: list[dict[str, Any]] = Field(default_factory=list)
    feeding_placeholder: list[dict[str, Any]] = Field(default_factory=list)
    activities: list[dict[str, Any]] = Field(default_factory=list)
    health_score: dict[str, Any] = Field(default_factory=dict)
    charts: DashboardCharts
    notifications_placeholder: list[dict[str, Any]] = Field(default_factory=list)
    ai_placeholder: dict[str, Any] = Field(default_factory=dict)
