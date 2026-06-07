from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime, date, time
from typing import List, Optional

# Prix Schemas
class PrixBase(BaseModel):
    moment: str  # 'matin' or 'soir'
    montant: Decimal

class PrixCreate(PrixBase):
    pass

class Prix(PrixBase):
    id: int
    terrain_id: int

    class Config:
        from_attributes = True
        orm_mode = True


# Terrain Schemas
class TerrainBase(BaseModel):
    nom: str
    description: Optional[str] = None
    type: Optional[str] = None
    capacite: Optional[int] = None
    image_url: Optional[str] = None
    disponible: Optional[bool] = True

class TerrainCreate(TerrainBase):
    pass

class TerrainUpdate(BaseModel):
    nom: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    capacite: Optional[int] = None
    image_url: Optional[str] = None
    disponible: Optional[bool] = None

class Terrain(TerrainBase):
    id: int
    created_at: datetime
    prix: List[Prix] = []

    class Config:
        from_attributes = True
        orm_mode = True


# Reservation Schemas
class ReservationBase(BaseModel):
    terrain_id: int
    nom_client: str
    telephone: str
    moment: str  # 'matin' or 'soir'
    heure: time
    date_reservation: date

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    nom_client: Optional[str] = None
    telephone: Optional[str] = None
    moment: Optional[str] = None
    heure: Optional[time] = None
    date_reservation: Optional[date] = None

class Reservation(ReservationBase):
    id: int
    prix_total: Decimal
    created_at: datetime
    terrain: Optional[Terrain] = None

    class Config:
        from_attributes = True
        orm_mode = True
