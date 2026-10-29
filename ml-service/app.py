
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, Field

from resume_parser import extract_text
from skill_analyzer import extract_skills
from recommender_updated import recommend_careers
from roadmap_generator import generate_roadmap
from fastapi.middleware.cors    import CORSMiddleware


app = FastAPI(title="AI Career Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextAnalysisRequest(BaseModel):
    resume_text: str = Field(min_length=1, max_length=100_000)


def analyze_resume_text(text: str) -> dict:
    skills = extract_skills(text)
    careers = recommend_careers(skills)

    best_career = careers[0] if careers else None
    roadmap = (
        generate_roadmap(best_career["missing_skills"])
        if best_career else []
    )

    return {
        "extracted_skills": skills,
        "skill_count": len(skills),
        "career_recommendations": careers,
        "suggested_learning_roadmap": roadmap,
        "notice": (
            "Results are based on keyword extraction and "
            "required-skill coverage, not hiring probability."
        ),
    }


@app.get("/")
def home():
    return {
        "message": "AI Career Intelligence Platform",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "Python ML service is running",
    }


@app.post("/analyze-text")
def analyze_text(request: TextAnalysisRequest):
    return analyze_resume_text(request.resume_text)


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    filename = file.filename or ""
    allowed_extensions = (".pdf", ".docx")

    if not filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Upload a PDF or DOCX resume.",
        )

    content = await file.read()

    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Resume must be 5 MB or smaller.",
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    try:
        text = extract_text(content, filename)
        return analyze_resume_text(text)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail="Could not read this resume file.",
        ) from exc
