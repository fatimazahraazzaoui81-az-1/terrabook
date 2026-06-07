CREATE TABLE IF NOT EXISTS terrains (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  capacite INT,
  image_url TEXT,
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prix (
  id SERIAL PRIMARY KEY,
  terrain_id INT REFERENCES terrains(id) ON DELETE CASCADE,
  moment VARCHAR(10) CHECK (moment IN ('matin','soir')),
  montant DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  terrain_id INT REFERENCES terrains(id),
  nom_client VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  moment VARCHAR(10) CHECK (moment IN ('matin','soir')),
  heure TIME NOT NULL,
  date_reservation DATE NOT NULL,
  prix_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
