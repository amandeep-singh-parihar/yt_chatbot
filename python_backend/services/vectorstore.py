from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

from core.llm import get_embedding_model


def create_vectorstore(transcript: str, video_id: str) -> FAISS:
    """
    Create a FAISS vector store from a transcript.

    Splits the transcript into chunks, embeds them, and returns
    a FAISS vector store ready for similarity search.

    Args:
        transcript: The full transcript text.
        video_id: The YouTube video ID (stored in metadata).

    Returns:
        A FAISS vector store containing the embedded chunks.
    """
    doc = Document(
        page_content=transcript,
        metadata={"video_id": video_id, "source": "youtube"},
    )

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents([doc])

    embedding_model = get_embedding_model()
    vector_store = FAISS.from_documents(documents=chunks, embedding=embedding_model)

    return vector_store
