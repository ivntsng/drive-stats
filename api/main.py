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


@app.get("/")
def root():
    return {"message": "You hit the root path!"}
