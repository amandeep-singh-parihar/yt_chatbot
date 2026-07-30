from langchain_core.documents import Document


def format_docs(retrieved_docs: list[Document]) -> str:
    """
    Format a list of retrieved documents into a single context string.

    Args:
        retrieved_docs: List of LangChain Document objects.

    Returns:
        A single string with all document contents joined by double newlines.
    """
    return "\n\n".join(doc.page_content for doc in retrieved_docs)
