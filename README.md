# drive-stats

drive-stats: A tool for auto enthusiasts to meticulously track vehicle data, including mileage, mods, and service history, fostering efficient car management.

## Features

-   🚗 Vehicle Management: Add and manage multiple vehicles
-   🔧 Maintenance Logging: Track service history and upcoming maintenance
-   🛠 Modification Records: Document vehicle modifications and upgrades
-   📱 Responsive Design: Full functionality on both desktop and mobile device

## Tech Stack

-   **Frontend**:

    -   React with TypeScript
    -   Vite for build tooling
    -   TailwindCSS for styling
    -   Shadcn/ui for component library

-   **Backend**:
    -   FastAPI (Python)
    -   PostgreSQL database
    -   Flyway for database migrations

## Design

-   [API Designs](docs/api-design.md)
-   [Data Models](docs/data-models.md)

## Functionality

## Project Initialization

### Environment Setup

1. Create environment files for both backend and frontend:

    **Backend Environment**: Create `api/.env` file with the following variables:

    ```
    # Security
    SIGNING_KEY=your_secure_signing_key
    ALGORITHM=HS256
    API_KEY=your_api_key_here

    # CORS Configuration
    CORS_HOST=http://localhost
    VITE_API_HOST=http://localhost:8000

    # Database Configuration
    DATABASE_URL=postgresql://username:password@postgres:5432/drivestats_db
    POSTGRES_DB=drivestats_db
    POSTGRES_USER=your_username
    POSTGRES_PASSWORD=your_secure_password
    ```

    **Frontend Environment**: Create `drive-stats/.env.local` file with:

    ```
    VITE_API_HOST=http://localhost:8000
    CORS_HOST=http://localhost
    ```

2. Make sure to add all `.env` files to your `.gitignore` to prevent committing sensitive information.

### Docker Compose Setup

To run the entire application stack using Docker Compose:

```
docker-compose -f docker-compose-dev.yaml up --build
```

### Frontend Setup

To run the frontend locally:

1. Navigate to the drive-stats directory:

    ```
    cd drive-stats
    ```

2. Install dependencies (if you haven't already):

    ```
    npm install
    ```

3. Start the development server:

    ```
    npm run dev
    ```

4. Open your browser and navigate to the URL displayed in the terminal (typically http://localhost:5173)

### Backend Setup

To run the backend locally:

1. Navigate to the api directory:

    ```
    cd api
    ```

2. Create and activate a virtual environment:

    ```
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install dependencies:

    ```
    pip install -r requirements.txt
    ```

4. Start the FastAPI server:

    ```
    uvicorn main:app --reload
    ```

5. Access the API documentation at http://localhost:8000/docs
