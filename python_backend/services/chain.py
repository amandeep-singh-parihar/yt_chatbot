from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import (
    RunnableParallel,
    RunnableLambda,
    RunnablePassthrough,
)
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import FAISS

from core.llm import get_chat_model
from services.transcript import fetch_transcript
from services.vectorstore import create_vectorstore
from utils.helpers import format_docs


RAG_PROMPT = PromptTemplate(
    template="""
    You are a helpful assistant.
    Answer ONLY from the provided transcript context.
    If the context is insufficient, just say you don't know.

    {context}
    Question: {query}
    """,
    input_variables=["context", "query"],
)


def build_rag_chain(vector_store: FAISS):
    """
    Build the RAG chain from a FAISS vector store.

    Args:
        vector_store: A FAISS vector store to use as the retriever.

    Returns:
        A LangChain runnable chain that takes a query string and
        returns a generated answer.
    """
    retriever = vector_store.as_retriever(
        search_type="similarity", search_kwargs={"k": 5}
    )

    parallel_chain = RunnableParallel(
        {
            "context": retriever | RunnableLambda(format_docs),
            "query": RunnablePassthrough(),
        }
    )

    parser = StrOutputParser()
    model = get_chat_model()

    chain = parallel_chain | RAG_PROMPT | model | parser
    return chain


def run_query(video_id: str, query: str) -> str:
    """
    Orchestrate the full RAG pipeline: fetch transcript → build
    vector store → run the chain → return the answer.

    Args:
        video_id: The YouTube video ID.
        query: The user's question about the video.

    Returns:
        The generated answer string.
    """
    transcript = fetch_transcript(video_id)
    vector_store = create_vectorstore(transcript, video_id)
    chain = build_rag_chain(vector_store)
    result = chain.invoke(query)
    return result
