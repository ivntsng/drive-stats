from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://drivestatsapp.com",  # Frontend URL
    "https://www.drivestatsapp.com",
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
    return {"Hello": "World"}

# Include your routers here
from routers import vehicles, vehicle_stats, accounts, auth, bug_reports

app.include_router(vehicles.router)
app.include_router(vehicle_stats.router)
app.include_router(accounts.router)
app.include_router(auth.router)
app.include_router(bug_reports.router)
