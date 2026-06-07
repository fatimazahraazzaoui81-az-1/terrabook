from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/terrains",
    tags=["terrains"]
)

@router.get("", response_model=List[schemas.Terrain])
def read_terrains(type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Terrain)
    if type:
        query = query.filter(models.Terrain.type.ilike(type))
    return query.order_by(models.Terrain.id.asc()).all()

@router.post("", response_model=schemas.Terrain, status_code=status.HTTP_201_CREATED)
def create_terrain(terrain_in: schemas.TerrainCreate, db: Session = Depends(get_db)):
    db_terrain = models.Terrain(**terrain_in.dict())
    db.add(db_terrain)
    db.commit()
    db.refresh(db_terrain)
    return db_terrain

@router.get("/{id}", response_model=schemas.Terrain)
def read_terrain(id: int, db: Session = Depends(get_db)):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")
    return terrain

@router.put("/{id}", response_model=schemas.Terrain)
def update_terrain(id: int, terrain_in: schemas.TerrainUpdate, db: Session = Depends(get_db)):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")
    update_data = terrain_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(terrain, field, value)
    db.commit()
    db.refresh(terrain)
    return terrain

@router.patch("/{id}/disponibilite", response_model=schemas.Terrain)
def toggle_availability(id: int, db: Session = Depends(get_db)):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")
    terrain.disponible = not terrain.disponible
    db.commit()
    db.refresh(terrain)
    return terrain

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_terrain(id: int, db: Session = Depends(get_db)):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")
    db.delete(terrain)
    db.commit()
    return None
