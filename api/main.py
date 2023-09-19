from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import vehicles

app = FastAPI()
app.include_router(vehicles.router)

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


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "year": 2022,
            "month": 12,
            "day": "9",
            "hour": 19,
            "min": 0,
            "tz:": "PST",
        }
    }


@app.get("/")
def root():
    return {"message": "You hit the root path!"}
