import logging
import os
from psycopg_pool import ConnectionPool

logger = logging.getLogger(__name__)

# Get database URL from environment
db_url = os.getenv("DATABASE_URL")
logger.info(f"Connecting to database: {db_url}")

try:
    # Create connection pool with more robust error handling
    pool = ConnectionPool(
        db_url,
        min_size=1,
        max_size=10,
        timeout=30,  # Increase timeout
        max_lifetime=600,  # 10 minutes max lifetime
        num_workers=2,
    )
    logger.info("Database connection pool created successfully")
except Exception as e:
    logger.error(f"Error creating database pool: {str(e)}")
    raise
