from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectRequest(BaseModel):
    domain: str
    skillLevel: str
    timeframe: str
    constraints: str

@app.post("/generate-projects")
async def generate_projects(request: ProjectRequest):
    print("Received request:", request)

    # Mock data to simulate OpenAI response
    data = {
        "titles": [
            f"{request.domain} Project 1",
            f"{request.domain} Project 2",
            f"{request.domain} Project 3"
        ],
        "summaries": [
            f"A beginner-friendly project about {request.domain} using {request.constraints}.",
            f"An intermediate project that explores {request.domain} concepts in depth.",
            f"An advanced project leveraging {request.domain} and {request.constraints} for real-world applications."
        ],
        "tools": [
            "Python", "React", "Flask"
        ]
    }

    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("form:app", host="0.0.0.0", port=8000, reload=True)
