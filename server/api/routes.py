from fastapi import APIRouter

from models.schemas import GenerateRequest, GenerateResponse
from services.chain import run_query


router = APIRouter()


@router.get("/")
def root():
    """Health check endpoint."""
    return {"message": "YT Chatbot API is running"}


@router.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Generate an answer from a YouTube video transcript.

    Takes a video ID and a user query, fetches the transcript,
    builds a RAG pipeline, and returns the AI-generated answer.
    """
    video_id = request.video_id
    query = request.query

    try:
        result = run_query(video_id, query)
        return GenerateResponse(status="success", response=result)
    except Exception as e:
        return GenerateResponse(status="error", message=str(e))
