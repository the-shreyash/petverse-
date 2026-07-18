from sqlalchemy import Column, String, Float, Boolean, JSON, Text
from app.database.base import Base

class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    
    # Internal DB, Google Places, Mapbox, OSM
    provider = Column(String(50), nullable=False, default="internal")
    provider_id = Column(String(255), nullable=True, unique=True)
    
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    zip_code = Column(String(20), nullable=True)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)
    
    is_verified = Column(Boolean, default=False)
    
    # JSON field for storing extra provider-specific data (rating, hours, etc)
    metadata_blob = Column(JSON, nullable=True)
