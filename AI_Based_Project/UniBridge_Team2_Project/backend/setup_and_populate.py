import asyncio, os, json
import mysql.connector
import subprocess

# MySQL config
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "1234",
    "database": "internships_db"
}

# Predefined domains and locations for batch crawling
DOMAINS = [
    "Web Development","Data Science","Machine Learning","AI","Cybersecurity",
    "Blockchain","Mobile App Development","Cloud Computing","Digital Marketing","SEO"
]

LOCATIONS = [
    "Remote","Bangalore","Mumbai","Delhi","Hyderabad","Pune","Chennai","Kolkata"
]

async def run_spider(domain="", location="", keywords=""):
    results_file = "results.json"
    if os.path.exists(results_file):
        os.remove(results_file)

    cmd = [
        "scrapy", "crawl", "internshala",
        "-a", f"domain={domain}",
        "-a", f"location={location}",
        "-a", f"keywords={keywords}",
        "-o", results_file
    ]

    proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    stdout, stderr = await proc.communicate()
    if proc.returncode != 0:
        print(f"Scrapy error for {domain}, {location}: {stderr.decode()}")
        return []

    results = []
    if os.path.exists(results_file):
        with open(results_file, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        item = json.loads(line)
                        results.append(item)
                    except:
                        continue
    return results

def save_to_db(items):
    if not items:
        return
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    for item in items:
        try:
            cursor.execute("""
                INSERT INTO internships (title, company, location, link, source)
                VALUES (%s, %s, %s, %s, %s)
            """, (item["title"], item["company"], item["location"], item["link"], item["source"]))
        except:
            continue
    conn.commit()
    conn.close()

async def main():
    # Loop through all domain-location combinations
    for domain in DOMAINS:
        for location in LOCATIONS:
            print(f"Scraping domain: {domain}, location: {location}")
            items = await run_spider(domain=domain, location=location)
            save_to_db(items)
            print(f"Inserted {len(items)} items for {domain} in {location}")

if __name__ == "__main__":
    asyncio.run(main())
