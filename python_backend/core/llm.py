from langchain_openai import ChatOpenAI, OpenAIEmbeddings


def get_chat_model() -> ChatOpenAI:
    """Get the configured ChatOpenAI model instance."""
    return ChatOpenAI()


def get_embedding_model() -> OpenAIEmbeddings:
    """Get the configured OpenAI embedding model instance."""
    return OpenAIEmbeddings(model="text-embedding-3-small")
