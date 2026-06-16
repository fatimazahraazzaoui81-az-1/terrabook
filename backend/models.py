from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Numeric, Time, Date, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Terrain(Base):
    __tablename__ = "terrains"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(50), nullable=True)
    capacite = Column(Integer, nullable=True)
    image_url = Column(Text, nullable=True)
    disponible = Column(Boolean, default=True)
    owner_id = Column(String(50), nullable=False, default="owner_1")
    created_at = Column(DateTime, default=func.now())

    # Cascade delete prices when terrain is deleted
    prix = relationship("Prix", back_populates="terrain", cascade="all, delete-orphan", lazy="joined")
    reservations = relationship("Reservation", back_populates="terrain")


class Prix(Base):
    __tablename__ = "prix"

    id = Column(Integer, primary_key=True, index=True)
    terrain_id = Column(Integer, ForeignKey("terrains.id", ondelete="CASCADE"), nullable=False)
    moment = Column(String(10), nullable=False)  # matin or soir
    montant = Column(Numeric(10, 2), nullable=False)

    terrain = relationship("Terrain", back_populates="prix")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    terrain_id = Column(Integer, ForeignKey("terrains.id"), nullable=False)
    nom_client = Column(String(100), nullable=False)
    telephone = Column(String(20), nullable=False)
    moment = Column(String(10), nullable=False)  # matin or soir
    heure = Column(Time, nullable=False)
    date_reservation = Column(Date, nullable=False)
    prix_total = Column(Numeric(10, 2), nullable=False)
    user_id = Column(String(50), nullable=False, default="client_1")
    created_at = Column(DateTime, default=func.now())

    terrain = relationship("Terrain", back_populates="reservations", lazy="joined")
