from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/terrains",
    tags=["terrains"]
)

# ── Auth helpers ─────────────────────────────────────────────────────────────

def get_current_user(
    x_user_role: Optional[str] = Header(None, alias="X-User-Role"),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
):
    """Extract user info from request headers. Defaults to CLIENT if missing."""
    role = x_user_role or "CLIENT"
    user_id = x_user_id or "client_1"
    if role not in ("CLIENT", "OWNER", "ADMIN"):
        raise HTTPException(status_code=400, detail="Rôle utilisateur invalide")
    return {"role": role, "id": user_id}


def require_role(*allowed_roles: str):
    """FastAPI dependency factory – returns 403 if the caller's role is not in allowed_roles."""
    def _dep(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas l'autorisation d'effectuer cette action.",
            )
        return current_user
    return _dep


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("", response_model=List[schemas.Terrain])
def read_terrains(type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Terrain)
    if type:
        query = query.filter(models.Terrain.type.ilike(type))
    return query.order_by(models.Terrain.id.asc()).all()


@router.get("/{id}", response_model=schemas.Terrain)
def read_terrain(id: int, db: Session = Depends(get_db)):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")
    return terrain


@router.post("", response_model=schemas.Terrain, status_code=status.HTTP_201_CREATED)
def create_terrain(
    terrain_in: schemas.TerrainCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("OWNER", "ADMIN")),
):
    # owner_id is NOT in TerrainCreate schema, so no duplicate kwarg issue
    db_terrain = models.Terrain(**terrain_in.dict(), owner_id=current_user["id"])
    db.add(db_terrain)
    db.flush()

    # Add default prices so the terrain is immediately bookable
    db.add_all([
        models.Prix(terrain_id=db_terrain.id, moment="matin", montant=30.00),
        models.Prix(terrain_id=db_terrain.id, moment="soir", montant=50.00),
    ])

    db.commit()
    db.refresh(db_terrain)
    return db_terrain


@router.put("/{id}", response_model=schemas.Terrain)
def update_terrain(
    id: int,
    terrain_in: schemas.TerrainUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("OWNER", "ADMIN")),
):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")

    # OWNER can only modify their own terrains
    if current_user["role"] == "OWNER" and terrain.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas le propriétaire de ce terrain.")

    update_data = terrain_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(terrain, field, value)
    db.commit()
    db.refresh(terrain)
    return terrain


@router.patch("/{id}/disponibilite", response_model=schemas.Terrain)
def toggle_availability(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("OWNER", "ADMIN")),
):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")

    if current_user["role"] == "OWNER" and terrain.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas le propriétaire de ce terrain.")

    terrain.disponible = not terrain.disponible
    db.commit()
    db.refresh(terrain)
    return terrain


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_terrain(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("OWNER", "ADMIN")),
):
    terrain = db.query(models.Terrain).filter(models.Terrain.id == id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")

    if current_user["role"] == "OWNER" and terrain.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas le propriétaire de ce terrain.")

    db.delete(terrain)
    db.commit()
    return None
