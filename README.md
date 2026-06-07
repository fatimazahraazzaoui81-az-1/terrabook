# TerraBook — Sports Terrain Reservation Platform

TerraBook is a premium sports terrain reservation application. It allows managers and clients to find, filter, and reserve sports terrains (Padel, Football, Tennis) and instantly view/print booking confirmation receipts.

The project is built using:
- **Frontend:** Next.js 14 (App Router) with TypeScript & Tailwind CSS
- **Backend:** FastAPI (Python 3.11) with SQLAlchemy ORM
- **Database:** PostgreSQL running in a isolated Docker container

---

## Folder Structure

```text
terrabook/
├── backend/
│   ├── routers/
│   │   ├── terrains.py
│   │   ├── prix.py
│   │   └── reservations.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── schema.sql
│   ├── seed.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── terrains/[id]/page.tsx
│   │   └── reservations/page.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── TerrainCard.tsx
│   │   ├── ReservationForm.tsx
│   │   ├── FicheModal.tsx
│   │   └── HistoriqueTable.tsx
│   ├── public/
│   │   └── images/
│   ├── lib/
│   │   └── api.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
└── docker-compose.yml
```

---

## Setup & Running Instructions

### 1. Database Setup (Docker)

Spin up the dedicated PostgreSQL container running on port `5433` (to avoid conflicts with default port `5432`):
```bash
docker compose up -d
```
The database will be initialized with:
- **DB Name:** `terrabook`
- **Username:** `terrabook_admin`
- **Password:** `terrabook_password`
- **Port:** `5433`

---

### 2. Backend Setup (FastAPI)

1. Navigate to the root directory and activate the virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
   - **Unix/macOS:**
     ```bash
     source .venv/bin/activate
     ```

2. Install python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Create the database tables and seed initial terrains and pricing:
   ```bash
   python backend/seed.py
   ```

4. Start the FastAPI development server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```
   The backend API will run on `http://localhost:8000`.

---

### 3. Frontend Setup (Next.js 14)

1. Open a new terminal in the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install frontend packages:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Key Features

- **Dashboard (Accueil):** Real-time search by name/description, sport category filtering (Tous / Foot / Tennis / Padel), availability badges, and green absolute-positioned pricing chips.
- **Reservation Details Page (`/terrains/[id]`):** Details split-layout with interactive forms, live price breakdown calculation based on selected moment (Matin/Soir), and error checking (like double-booking prevention).
- **Post-Booking Receipt Modal (`FicheModal`):** Instant overlay showing full booking receipt with an "Imprimer la fiche" action trigger that styles the document dynamically for paper printing.
- **Historique Page (`/reservations`):** Alternate-row tables with sticky green headers, real-time search filtering, and an action button to retrieve past receipts.
