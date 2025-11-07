from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Allow React frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ProjectRequest(BaseModel):
    domain: str
    skill: str
    timeframe: str
    constraints: str = ""

# POST endpoint
@app.post("/generate-ideas")
async def generate_projects(request: ProjectRequest):
    """
    Generate project ideas using GPT-3.5 based on user input.
    Returns JSON with consistent structure:
    { "projects": [ {title, description, tools}, ... ] }
    """

    # ✅ Fallback if API fails
    fallback = {
        "projects": [
            {
                "title": f"{request.domain} Project 1",
                "description": f"A simple beginner-friendly {request.domain} project for {request.skill} learners ({request.timeframe} term).",
                "tools": ["Python", "React", "Flask"]
            },
            {
                "title": f"{request.domain} Project 2",
                "description": f"An intermediate {request.domain} project idea for {request.skill} developers. Ideal for {request.timeframe} timeframe.",
                "tools": ["FastAPI", "MySQL", "Docker"]
            },
            {
                "title": f"{request.domain} Project 3",
                "description": f"An advanced {request.domain} project that explores modern tools and scalability.",
                "tools": ["Next.js", "FastAPI", "PostgreSQL"]
            },
        ]
    }

    prompt = f"""
    Generate 3 project ideas in JSON format based on the following:
    Domain: {request.domain}
    Skill Level: {request.skill}
    Timeframe: {request.timeframe}
    Constraints: {request.constraints}

    Format your response strictly like this:
    {{
        "projects": [
            {{
                "title": "Project Title 1",
                "description": "Short summary of the project",
                "tools": ["Tool1", "Tool2"]
            }},
            {{
                "title": "Project Title 2",
                "description": "Short summary of the project",
                "tools": ["Tool3", "Tool4"]
            }},
            {{
                "title": "Project Title 3",
                "description": "Short summary of the project",
                "tools": ["Tool5", "Tool6"]
            }}
        ]
    }}
    """

    try:
        # ✅ Use new Chat Completions API format
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500,
        )

        output_text = response.choices[0].message.content.strip()

        # Try parsing GPT output as JSON
        data = json.loads(output_text)

        # Validate structure
        if "projects" not in data:
            print("⚠️ Unexpected response structure, using fallback.")
            data = fallback

    except Exception as e:
        print("❌ Error while calling OpenAI API:", e)
        data = fallback

    return data


@app.get("/")
def root():
    return {"message": "Backend is running successfully 🚀"}
