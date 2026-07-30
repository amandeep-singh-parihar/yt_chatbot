from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv(usecwd=True))

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

origins_env = os.getenv("ALLOW_ORIGINS", "*")
ALLOW_ORIGINS = (
    [origin.strip() for origin in origins_env.split(",") if origin.strip()]
    if origins_env != "*"
    else ["*"]
)