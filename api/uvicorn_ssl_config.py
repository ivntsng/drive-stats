import uvicorn
from main import app  # Replace with your actual app import

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=443,
        ssl_certfile="/etc/ssl/certs/fullchain.pem",
        ssl_keyfile="/etc/ssl/private/privkey.pem",
    )
