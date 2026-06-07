from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import terrains, prix, reservations

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TerraBook API",
    description="Backend API for the TerraBook sports terrain reservation platform",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(terrains.router)
app.include_router(prix.router)
app.include_router(reservations.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "TerraBook API"
    }
