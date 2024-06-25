from fastapi import APIRouter


tags_metadata = [
    {
        "name": "Vehicle Modifications",
        "description": "Endpoints related to vehicle Modifications.",
    },
]

router = APIRouter(tags=["Vehicles Modifications"])
