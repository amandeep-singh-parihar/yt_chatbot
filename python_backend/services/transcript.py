from youtube_transcript_api import YouTubeTranscriptApi


def fetch_transcript(video_id: str) -> str:
    """
    Fetch the English transcript for a YouTube video.

    Args:
        video_id: The YouTube video ID.

    Returns:
        The full transcript text as a single string.

    Raises:
        Exception: If the transcript cannot be fetched.
    """
    ytt_api = YouTubeTranscriptApi()
    transcript_list = ytt_api.fetch(video_id=video_id, languages=["en"])
    transcript = " ".join(chunk.text for chunk in transcript_list)
    return transcript
