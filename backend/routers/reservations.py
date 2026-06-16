from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/reservations",
    tags=["reservations"]
)

# ── Auth helpers ─────────────────────────────────────────────────────────────

def get_current_user(
    x_user_role: Optional[str] = Header(None, alias="X-User-Role"),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
):
    role = x_user_role or "CLIENT"
    user_id = x_user_id or "client_1"
    if role not in ("CLIENT", "OWNER", "ADMIN"):
        raise HTTPException(status_code=400, detail="Rôle utilisateur invalide")
    return {"role": role, "id": user_id}


def require_role(*allowed_roles: str):
    def _dep(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas l'autorisation d'effectuer cette action.",
            )
        return current_user
    return _dep


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("", response_model=schemas.Reservation, status_code=status.HTTP_201_CREATED)
def create_reservation(
    reservation_in: schemas.ReservationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # 1. Verify terrain exists
    terrain = db.query(models.Terrain).filter(models.Terrain.id == reservation_in.terrain_id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")

    # 2. Check availability
    if not terrain.disponible:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce terrain n'est pas disponible pour de nouvelles réservations",
        )

    # 3. Get price
    price_entry = db.query(models.Prix).filter(
        models.Prix.terrain_id == reservation_in.terrain_id,
        models.Prix.moment == reservation_in.moment,
    ).first()
    if not price_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Le tarif pour le moment '{reservation_in.moment}' n'est pas configuré pour ce terrain",
        )

    # 4. Double-booking check
    existing = db.query(models.Reservation).filter(
        models.Reservation.terrain_id == reservation_in.terrain_id,
        models.Reservation.date_reservation == reservation_in.date_reservation,
        models.Reservation.moment == reservation_in.moment,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce terrain est déjà réservé pour ce moment à cette date.",
        )

    # 5. Create reservation
    db_reservation = models.Reservation(
        terrain_id=reservation_in.terrain_id,
        nom_client=reservation_in.nom_client,
        telephone=reservation_in.telephone,
        moment=reservation_in.moment,
        heure=reservation_in.heure,
        date_reservation=reservation_in.date_reservation,
        prix_total=price_entry.montant,
        user_id=current_user["id"],
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


@router.get("", response_model=List[schemas.Reservation])
def read_reservations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] == "CLIENT":
        # Client sees only their own reservations
        return (
            db.query(models.Reservation)
            .filter(models.Reservation.user_id == current_user["id"])
            .order_by(models.Reservation.created_at.desc())
            .all()
        )
    elif current_user["role"] == "OWNER":
        # Owner sees reservations on their terrains
        return (
            db.query(models.Reservation)
            .join(models.Terrain)
            .filter(models.Terrain.owner_id == current_user["id"])
            .order_by(models.Reservation.created_at.desc())
            .all()
        )
    else:
        # Admin sees everything
        return db.query(models.Reservation).order_by(models.Reservation.created_at.desc()).all()


@router.get("/{id}", response_model=schemas.Reservation)
def read_reservation(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    r = db.query(models.Reservation).filter(models.Reservation.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")

    if current_user["role"] == "CLIENT" and r.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")
    if current_user["role"] == "OWNER" and r.terrain.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")

    return r


@router.put("/{id}", response_model=schemas.Reservation)
def update_reservation(
    id: int,
    reservation_update: schemas.ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    r = db.query(models.Reservation).filter(models.Reservation.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")

    if current_user["role"] == "ADMIN":
        pass
    elif current_user["role"] == "OWNER" and r.terrain.owner_id == current_user["id"]:
        pass
    elif current_user["role"] == "CLIENT" and r.user_id == current_user["id"]:
        pass
    else:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas autorisé à modifier cette réservation.")

    for key, value in reservation_update.dict(exclude_unset=True).items():
        setattr(r, key, value)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    r = db.query(models.Reservation).filter(models.Reservation.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")

    if current_user["role"] == "ADMIN":
        pass
    elif current_user["role"] == "OWNER" and r.terrain.owner_id == current_user["id"]:
        pass
    elif current_user["role"] == "CLIENT" and r.user_id == current_user["id"]:
        pass
    else:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas autorisé à supprimer cette réservation.")

    db.delete(r)
    db.commit()
    return None
