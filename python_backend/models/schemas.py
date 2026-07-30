from pydantic import BaseModel


class GenerateRequest(BaseModel):
    """Request model for the /generate endpoint."""

    video_id: str
    query: str


class GenerateResponse(BaseModel):
    """Response model for the /generate endpoint."""

    status: str
    response: str | None = None
    message: str | None = None
