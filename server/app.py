from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import ALLOW_ORIGINS
from api.routes import router


app = FastAPI(
    title="YT Chatbot API",
    description="Chat with any YouTube video using RAG",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
