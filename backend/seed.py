import sys
import os
from datetime import date, time

# Add the current directory to sys.path so we can import from database and models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base
import models

def seed_database():
    print("Dropping database tables...")
    Base.metadata.drop_all(bind=engine)
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding database with default terrains...")

        # 1. Padel Central (owner_1)
        padel1 = models.Terrain(
            nom="Terrain Padel Central",
            description="Terrain de Padel haut de gamme en gazon synthétique avec éclairage LED de dernière génération. Idéal pour des parties dynamiques.",
            type="Padel",
            capacite=4,
            image_url="/images/padel1.png",
            disponible=True,
            owner_id="owner_1"
        )
        db.add(padel1)
        db.flush()

        prix_padel1_matin = models.Prix(terrain_id=padel1.id, moment="matin", montant=40.00)
        prix_padel1_soir = models.Prix(terrain_id=padel1.id, moment="soir", montant=60.00)
        db.add_all([prix_padel1_matin, prix_padel1_soir])

        # 2. Football Arena (owner_1)
        foot1 = models.Terrain(
            nom="Stade de Football Arena",
            description="Terrain de Football à 5 avec pelouse synthétique de qualité professionnelle. Équipé de vestiaires et de projecteurs de nuit.",
            type="Foot",
            capacite=10,
            image_url="/images/football1.png",
            disponible=True,
            owner_id="owner_1"
        )
        db.add(foot1)
        db.flush()

        prix_foot1_matin = models.Prix(terrain_id=foot1.id, moment="matin", montant=50.00)
        prix_foot1_soir = models.Prix(terrain_id=foot1.id, moment="soir", montant=80.00)
        db.add_all([prix_foot1_matin, prix_foot1_soir])

        # 3. Tennis Court Central (owner_2)
        tennis1 = models.Terrain(
            nom="Court Centrale Tennis",
            description="Court de tennis officiel en terre battue traditionnelle, parfait pour le simple ou le double. Entretien régulier.",
            type="Tennis",
            capacite=4,
            image_url="/images/tennis1.png",
            disponible=True,
            owner_id="owner_2"
        )
        db.add(tennis1)
        db.flush()

        prix_tennis1_matin = models.Prix(terrain_id=tennis1.id, moment="matin", montant=30.00)
        prix_tennis1_soir = models.Prix(terrain_id=tennis1.id, moment="soir", montant=45.00)
        db.add_all([prix_tennis1_matin, prix_tennis1_soir])

        # 4. Padel Panoramic (owner_2)
        padel2 = models.Terrain(
            nom="Terrain Padel Panoramic",
            description="Court de Padel panoramique avec parois transparentes renforcées pour une vue imprenable et des sensations de jeu uniques.",
            type="Padel",
            capacite=4,
            image_url="/images/padel2.png",
            disponible=True,
            owner_id="owner_2"
        )
        db.add(padel2)
        db.flush()

        prix_padel2_matin = models.Prix(terrain_id=padel2.id, moment="matin", montant=45.00)
        prix_padel2_soir = models.Prix(terrain_id=padel2.id, moment="soir", montant=65.00)
        db.add_all([prix_padel2_matin, prix_padel2_soir])

        # Seeding default reservations
        print("Seeding database with default reservations...")
        res1 = models.Reservation(
            terrain_id=padel1.id,
            nom_client="Marie Dupont",
            telephone="0601020304",
            moment="matin",
            heure=time(10, 0),
            date_reservation=date.today(),
            prix_total=40.00,
            user_id="client_1"
        )
        res2 = models.Reservation(
            terrain_id=tennis1.id,
            nom_client="Jean Martin",
            telephone="0611121314",
            moment="soir",
            heure=time(18, 0),
            date_reservation=date.today(),
            prix_total=45.00,
            user_id="client_2"
        )
        db.add_all([res1, res2])

        db.commit()
        print("Database seeding completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
