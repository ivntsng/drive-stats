from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import vehicles, vehicle_stats, accounts

app = FastAPI()
app.include_router(vehicles.router)
app.include_router(vehicle_stats.router)
app.include_router(accounts.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "CORS_HOST",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
