from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/reservations",
    tags=["reservations"]
)

@router.post("", response_model=schemas.Reservation, status_code=status.HTTP_201_CREATED)
def create_reservation(reservation_in: schemas.ReservationCreate, db: Session = Depends(get_db)):
    # 1. Verify terrain exists
    terrain = db.query(models.Terrain).filter(models.Terrain.id == reservation_in.terrain_id).first()
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain non trouvé")
    
    # 2. Check if terrain is disponible
    if not terrain.disponible:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce terrain n'est pas disponible pour de nouvelles réservations"
        )
    
    # 3. Retrieve price for the specified terrain and moment
    price_entry = db.query(models.Prix).filter(
        models.Prix.terrain_id == reservation_in.terrain_id,
        models.Prix.moment == reservation_in.moment
    ).first()
    
    if not price_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Le tarif pour le moment '{reservation_in.moment}' n'est pas configuré pour ce terrain"
        )
    
    # 4. Optional double-booking prevention check
    existing_booking = db.query(models.Reservation).filter(
        models.Reservation.terrain_id == reservation_in.terrain_id,
        models.Reservation.date_reservation == reservation_in.date_reservation,
        models.Reservation.moment == reservation_in.moment
    ).first()
    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce terrain est déjà réservé pour ce moment à cette date."
        )

    # 5. Create reservation record
    db_reservation = models.Reservation(
        terrain_id=reservation_in.terrain_id,
        nom_client=reservation_in.nom_client,
        telephone=reservation_in.telephone,
        moment=reservation_in.moment,
        heure=reservation_in.heure,
        date_reservation=reservation_in.date_reservation,
        prix_total=price_entry.montant
    )
    
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

@router.get("", response_model=List[schemas.Reservation])
def read_reservations(db: Session = Depends(get_db)):
    # Order by newest first
    return db.query(models.Reservation).order_by(models.Reservation.created_at.desc()).all()

@router.get("/{id}", response_model=schemas.Reservation)
def read_reservation(id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(models.Reservation).filter(models.Reservation.id == id).first()
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    return db_reservation

@router.put("/{id}", response_model=schemas.Reservation)
def update_reservation(id: int, reservation_update: schemas.ReservationUpdate, db: Session = Depends(get_db)):
    db_reservation = db.query(models.Reservation).filter(models.Reservation.id == id).first()
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    update_data = reservation_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reservation, key, value)
        
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(models.Reservation).filter(models.Reservation.id == id).first()
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    db.delete(db_reservation)
    db.commit()
    return None
