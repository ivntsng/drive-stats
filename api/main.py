from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import vehicles, vehicle_stats, accounts, auth
import os


app = FastAPI()

app.include_router(vehicles.router)
app.include_router(vehicle_stats.router)
app.include_router(accounts.router)
app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the DriveStats API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
