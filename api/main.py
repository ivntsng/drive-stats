from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import vehicles, vehicle_stats, accounts, auth, bug_reports
import os

app = FastAPI()

app.include_router(vehicles.router)
app.include_router(vehicle_stats.router)
app.include_router(accounts.router)
app.include_router(auth.router)
app.include_router(bug_reports.router)

# Set CORS origins to allow specific frontend hosts
origins = [
    os.environ.get("CORS_HOST", "http://localhost:5173"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
