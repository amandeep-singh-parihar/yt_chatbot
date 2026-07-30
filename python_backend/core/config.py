from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv(usecwd=True))

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

origins_env = os.getenv("ALLOW_ORIGINS", "*")
ALLOW_ORIGINS = (
    "http://localhost:3000",
    # [origin.strip() for origin in origins_env.split(",") if origin.strip()]
    # if origins_env != "*"
    # else ["*"]
)