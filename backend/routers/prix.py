from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(
    tags=["prix"]
)

@router.get("/terrains/{id}/prix", response_model=List[schemas.Prix])
def read_terrain_prix(id: int, db: Session = Depends(get_db)):
    # Verify terrain exists
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")
    
    # Return prices
    return db.query(models.Prix).filter(models.Prix.terrain_id == id).all()
