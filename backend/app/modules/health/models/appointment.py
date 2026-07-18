from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.base import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True)
    pet_id = Column(String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False)
    clinic_id = Column(String(36), ForeignKey("clinics.id", ondelete="SET NULL"), nullable=True)
    
    # "Upcoming", "Completed", "Cancelled", "Scheduled", "Past"
    status = Column(String(50), nullable=False, default="Scheduled")
    
    visit_date = Column(DateTime(timezone=True), nullable=False)
    reason = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Optional denormalized fields for quick access without JOIN
    clinic_name = Column(String(255), nullable=True)
    veterinarian = Column(String(255), nullable=True)

    pet = relationship("Pet", backref="appointments")
    clinic = relationship("Clinic", backref="appointments")
