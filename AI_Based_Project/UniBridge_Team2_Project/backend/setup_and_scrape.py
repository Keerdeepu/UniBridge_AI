import mysql.connector
from mysql.connector import errorcode
import asyncio
from main import run_scrapy

# ✅ MySQL configuration
DB_CONFIG = {
    "host": "localhost",
    "user": "root",       # Replace with your MySQL username
    "password": "1234", # Replace with your MySQL password
    "database": "internships_db"
}

def init_db():
    """Create database table if not exists"""
    try:
        conn = mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"]
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
        cursor.execute(f"USE {DB_CONFIG['database']}")

        # Create internships table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS internships (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                link VARCHAR(255),
                source VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database and table ready")
    except mysql.connector.Error as err:
        print(f"❌ Database error: {err}")

# ✅ Run the spider
async def main():
    init_db()
    # Example search parameters; change as needed
    await run_scrapy(
        domain="Web Development",
        location="Remote",
        keywords="Python",
        remote_only=False,
        paid_only=False,
        recently_posted=False
    )
    print("✅ Spider finished and data inserted into MySQL")

# Run async main
if __name__ == "__main__":
    asyncio.run(main())
