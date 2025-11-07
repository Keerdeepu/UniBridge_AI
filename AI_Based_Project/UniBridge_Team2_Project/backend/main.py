from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import os

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request structure
class SearchRequest(BaseModel):
    domain: str
    location: str
    keywords: str
    remote_only: bool = False       # <-- NEW
    paid_only: bool = False         # <-- NEW
    recent_only: bool = False 

@app.post("/search")
async def search(data: SearchRequest):
    results_file = "results.json"

    # Remove old results file if exists
    if os.path.exists(results_file):
        os.remove(results_file)

    # Run Scrapy spider
    try:
        subprocess.run([
            "scrapy", "crawl", "internshala",
            "-a", f"domain={data.domain}",
            "-a", f"location={data.location}",
            "-a", f"keywords={data.keywords}",
            "-a", f"remote_only={data.remote_only}",
            "-a", f"paid_only={data.paid_only}",
            "-a", f"recent_only={data.recent_only}",
            "-o", results_file
        ], check=True)
    except subprocess.CalledProcessError as e:
        return {"error": "Scrapy spider failed", "details": str(e)}

    # Read results safely
    results = []
    if os.path.exists(results_file):
        with open(results_file, "r", encoding="utf-8") as f:
            try:
                # Some Scrapy outputs JSON Lines, wrap into list if needed
                first_char = f.read(1)
                f.seek(0)
                if first_char == "[":
                    # Standard JSON array
                    results = json.load(f)
                else:
                    # JSON Lines
                    for line in f:
                        line = line.strip()
                        if line:
                            try:
                                results.append(json.loads(line))
                            except json.JSONDecodeError:
                                continue
            except Exception as e:
                print("Error reading results file:", e)

    # Ensure no null values for display
    for item in results:
        if not item.get("company"):
            item["company"] = "Unknown"
        if not item.get("title"):
            item["title"] = "No title"
        if not item.get("location"):
            item["location"] = data.location or "Remote"
        if not item.get("link"):
            item["link"] = "#"

    return {"results": results}
