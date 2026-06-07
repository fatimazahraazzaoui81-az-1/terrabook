import sys
import os

# Add the current directory to sys.path so we can import from database and models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base
import models

def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if terrains already exist
        existing_terrains_count = db.query(models.Terrain).count()
        if existing_terrains_count > 0:
            print("Database already contains terrains. Skipping seeding.")
            return

        print("Seeding database with default terrains...")

        # 1. Padel Central
        padel1 = models.Terrain(
            nom="Terrain Padel Central",
            description="Terrain de Padel haut de gamme en gazon synthétique avec éclairage LED de dernière génération. Idéal pour des parties dynamiques.",
            type="Padel",
            capacite=4,
            image_url="/images/padel1.png",
            disponible=True
        )
        db.add(padel1)
        db.flush()  # to get the ID

        prix_padel1_matin = models.Prix(terrain_id=padel1.id, moment="matin", montant=40.00)
        prix_padel1_soir = models.Prix(terrain_id=padel1.id, moment="soir", montant=60.00)
        db.add_all([prix_padel1_matin, prix_padel1_soir])

        # 2. Football Arena
        foot1 = models.Terrain(
            nom="Stade de Football Arena",
            description="Terrain de Football à 5 avec pelouse synthétique de qualité professionnelle. Équipé de vestiaires et de projecteurs de nuit.",
            type="Foot",
            capacite=10,
            image_url="/images/football1.png",
            disponible=True
        )
        db.add(foot1)
        db.flush()

        prix_foot1_matin = models.Prix(terrain_id=foot1.id, moment="matin", montant=50.00)
        prix_foot1_soir = models.Prix(terrain_id=foot1.id, moment="soir", montant=80.00)
        db.add_all([prix_foot1_matin, prix_foot1_soir])

        # 3. Tennis Court Central
        tennis1 = models.Terrain(
            nom="Court Centrale Tennis",
            description="Court de tennis officiel en terre battue traditionnelle, parfait pour le simple ou le double. Entretien régulier.",
            type="Tennis",
            capacite=4,
            image_url="/images/tennis1.png",
            disponible=True
        )
        db.add(tennis1)
        db.flush()

        prix_tennis1_matin = models.Prix(terrain_id=tennis1.id, moment="matin", montant=30.00)
        prix_tennis1_soir = models.Prix(terrain_id=tennis1.id, moment="soir", montant=45.00)
        db.add_all([prix_tennis1_matin, prix_tennis1_soir])

        # 4. Padel Panoramic
        padel2 = models.Terrain(
            nom="Terrain Padel Panoramic",
            description="Court de Padel panoramique avec parois transparentes renforcées pour une vue imprenable et des sensations de jeu uniques.",
            type="Padel",
            capacite=4,
            image_url="/images/padel2.png",
            disponible=True
        )
        db.add(padel2)
        db.flush()

        prix_padel2_matin = models.Prix(terrain_id=padel2.id, moment="matin", montant=45.00)
        prix_padel2_soir = models.Prix(terrain_id=padel2.id, moment="soir", montant=65.00)
        db.add_all([prix_padel2_matin, prix_padel2_soir])

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
