from fastapi import FastAPI
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from core.llm import ChatOpenAI, OpenAIEmbeddings
from core.config import ALLOW_ORIGINS
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores import FAISS
from langchain_classic.retrievers.multi_query import MultiQueryRetriever
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import (
    RunnableParallel,
    RunnableLambda,
    RunnablePassthrough,
)
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel


class GenerateRequest(BaseModel):
    video_id: str
    query: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "this is root"}


@app.post("/generate")
async def generate(request: GenerateRequest):
    # load the transcript
    # video_id = "ssP31IenzYA"
    video_id = request.video_id
    query = request.query
    print("video id -> ", video_id)
    print("query -> ", query)
    ytt_api = YouTubeTranscriptApi()
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.fetch(video_id=video_id, languages=["en"])
        
        print("transcript_list -> ", transcript_list)

        transcript = " ".join(chunk.text for chunk in transcript_list)

    except Exception as e:
        print(e)
        return {"status": "error", "message": str(e)}
        print(f"Error : {type(e).__name__}: {e}")

    doc = Document(
        page_content=transcript, metadata={"video_id": video_id, "source": "youtube"}
    )
    
    print("transcirpt -> ", transcript)

    # chunking the transcript
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents([doc])
    
    print("chunks -> ", chunks)

    # creare embeddings of the chunks and store in the vector store
    embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")
    vector_store = FAISS.from_documents(documents=chunks, embedding=embedding_model)

    # retriever
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k":5})

    # augmentation
    prompt = PromptTemplate(
        template="""
        You are a helpful assistent.
        Answer ONLY from the provided transcript context.
        If the context is insufficient, just say you don't know.

        {context}
        Question: {query}
        """,
        input_variables=["context", "query"],
    )

    # query = "who is the guest in the video?"
    retrieved_docs = retriever.invoke(query)
    
    print("retrieve docs -> ", retrieved_docs)

    def format_docs(retrieved_docs):
        context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)
        return context_text

    final_prompt = prompt.invoke(
        {"context": format_docs(retrieved_docs), "query": query}
    )
    
    print("final_prompt -> ", final_prompt)

    # generation
    parallel_chain = RunnableParallel(
        {
            "context": retriever | RunnableLambda(format_docs),
            "query": RunnablePassthrough(),
        }
    )

    parser = StrOutputParser()
    
    model = ChatOpenAI()

    main_chain = parallel_chain | prompt | model | parser

    # main_chain.invoke("who is the guest in the video")
    result = main_chain.invoke(query)
    print("result -> ", result)
    return {"status": "success", "response": result}
