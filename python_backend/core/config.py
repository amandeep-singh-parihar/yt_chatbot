import os

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(usecwd=True))

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# CORS
origins_env = os.getenv("ALLOW_ORIGINS", "http://localhost:3000")
ALLOW_ORIGINS = [
    origin.strip() for origin in origins_env.split(",") if origin.strip()
]