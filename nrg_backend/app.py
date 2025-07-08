# app.py - Local FastAPI server for RatatouilleGen
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import threading
import subprocess
import requests
import json
import time
from difflib import SequenceMatcher

# LangChain imports
from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA

app = FastAPI(title="RatatouilleGen API", version="1.0.0")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class RecipeRequest(BaseModel):
    region: str
    ingredients: str

class RecipeResponse(BaseModel):
    recipe: str
    sources: Optional[list] = None
    status: str
    retry_count: Optional[int] = 0
    novelty_message: Optional[str] = None

# Global variables
chain = None
ollama_started = False

def start_ollama():
    """Start Ollama server in background"""
    global ollama_started
    if not ollama_started:
        try:
            os.environ['OLLAMA_HOST'] = '0.0.0.0:11434'
            os.environ['OLLAMA_ORIGINS'] = '*'
            subprocess.Popen(["ollama", "serve"])
            time.sleep(5)  # Wait for server to start
            ollama_started = True
            print("Ollama server started")
        except Exception as e:
            print(f"Error starting Ollama: {e}")

def load_rag_chain():
    """Initialize the RAG chain"""
    global chain
    
    if chain is None:
        try:
            # Set HuggingFace cache to tmpfs to avoid disk space issues
            os.environ['HF_HOME'] = f'/run/user/{os.getuid()}/huggingface'
            os.environ['TRANSFORMERS_CACHE'] = f'/run/user/{os.getuid()}/huggingface/transformers'
            os.makedirs(f'/run/user/{os.getuid()}/huggingface', exist_ok=True)
            
            # Initialize model
            model = ChatOllama(model="llama3", temperature=0.2)
            
            # Your existing prompt template
            prompt = PromptTemplate.from_template(
                """You are an experienced culinary master innovator.
                
                The following recipes show the COOKING STYLE and TRADITIONS of regional cuisine:
                {context}
                
                CRITICAL: These recipes are for INSPIRATION ONLY to understand cooking techniques and regional style. DO NOT copy ingredients or steps from these recipes.
                
                Your task: Create a completely NEW recipe using ONLY the ingredients from this query: {question}
                
                STRICT RULES:
                - Use ONLY the ingredients provided in the query
                - Create something never made before
                - Follow regional cooking techniques learned from context
                - Make it authentic but completely novel
                FORMAT (follow exactly):
                Recipe Title:
                The title should be a summary of the dish in max 3 words, also reflecting the region/culture
                Example : if query is India and ingredients are Chicken , Rice , Garam masala
                Recipe title : Bhuna Murg Chawal

                Taste : The taste of the dish should adhere to the preparation. If no sweetenery ingredients is added it should not predict sweet
                Regional Context:
                Brief explanation of how this dish authentically represents the regional cuisine and why these ingredients harmonize within this culinary tradition.
                Ingredient List (for 4 servings):
                Precise measurements treating each ingredient as essential within the regional style. No substitutions. No extras beyond what's listed.
                Preparation Steps:
                MANDATORY: You MUST provide detailed step-by-step cooking instructions. Never leave this section blank.
                1. [First step with specific technique]
                2. [Second step with timing]
                3. [Continue with all necessary steps]
                - Use clear steps following traditional regional cooking sequences
                - Include region-specific techniques and timing
                - Guide the cook like a cultural mentor with sensory cues specific to the cuisine
                - Reference traditional cooking wisdom and regional preferences
                - Add Novelty fusions and Techniques that make the recipe novel and innovative.
                Chef's Notes:
                Reflect on the regional authenticity - how traditional techniques, cultural wisdom, and ingredient character unite to create something that honors the cuisine while being genuinely novel.
                CONSTRAINTS:
                - The recipe should be new , unorthodox and never seen before type
                - Use ONLY the listed ingredients - no additions, substitutions, or extras
                - Stay authentic to the regional cuisine's core principles and techniques and make new combinations.
                - Create something new yet culturally grounded
                - Focus on emotional satisfaction and cultural resonance
                - The preparation should be stunning. staying within the constraints
                Recipe:"""
            )
            
            # Initialize embeddings
            embedding = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            
            # Load vector store in tmpfs to avoid disk space issues
            tmpfs_db_path = f"/run/user/{os.getuid()}/recipe_chroma_db"
            os.makedirs(tmpfs_db_path, exist_ok=True)
            
            # Copy existing DB if it exists
            if os.path.exists("./recipe_chroma_db") and not os.path.exists(f"{tmpfs_db_path}/chroma.sqlite3"):
                import shutil
                shutil.copytree("./recipe_chroma_db", tmpfs_db_path, dirs_exist_ok=True)
            
            vector_store = Chroma(
                persist_directory=tmpfs_db_path,
                embedding_function=embedding
            )
            
            retriever = vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3}
            )
            
            # Create QA chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=model,
                chain_type="stuff",
                retriever=retriever,
                chain_type_kwargs={"prompt": prompt},
                return_source_documents=True
            )
            
            def similarity_check(recipe_text, source_docs, threshold=0.3):
                """Check if generated recipe is too similar to source documents"""
                recipe_clean = ' '.join(recipe_text.lower().split())
                
                for doc in source_docs:
                    doc_clean = ' '.join(doc.page_content.lower().split())
                    similarity = SequenceMatcher(None, recipe_clean, doc_clean).ratio()
                    if similarity > threshold:
                        return True, similarity
                return False, 0
            
            def enhanced_chain(inputs):
                region = inputs["region"]
                ingredients = inputs["ingredients"]
                retry_count = inputs.get("retry_count", 0)
                
                # Adjust query based on retry count for more novelty
                if retry_count == 0:
                    formatted_query = f"Create a New, novel recipe from Region: {region} using these Ingredients: {ingredients} only. No listed ingredients should be left out. No substitutions or ingredients should be added. Not even Pantry staples like salt, oil, etc."
                else:
                    formatted_query = f"Create an EXTREMELY INNOVATIVE and  CREATIVE recipe from Region: {region} using these Ingredients: {ingredients} only. Make it unconventional and never-before-seen.yet edible and plausible."
                
                result = qa_chain({"query": formatted_query})
                
                # Check similarity with source documents
                is_similar, similarity_score = similarity_check(
                    result["result"], 
                    result["source_documents"]
                )
                
                return {
                    "answer": result["result"],
                    "context": result["source_documents"],
                    "is_similar": is_similar,
                    "similarity_score": similarity_score,
                    "retry_count": retry_count
                }
            
            chain = enhanced_chain
            print("RAG chain loaded successfully")
            
        except Exception as e:
            print(f"Error loading RAG chain: {e}")
            raise

@app.on_event("startup")
async def startup_event():
    """Initialize everything on startup"""
    print("Starting RatatouilleGen API...")
    start_ollama()
    load_rag_chain()

@app.get("/")
async def root():
    return {"message": "RatatouilleGen API is running!"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ollama_running": ollama_started,
        "chain_loaded": chain is not None
    }

@app.post("/generate-recipe", response_model=RecipeResponse)
async def generate_recipe(request: RecipeRequest):
    """Generate a recipe based on region and ingredients with novelty feedback loop"""
    
    if chain is None:
        raise HTTPException(status_code=503, detail="RAG chain not initialized")
    
    try:
        retry_count = 0
        max_retries = 2
        novelty_message = None
        
        while retry_count <= max_retries:
            # Generate recipe
            result = chain({
                "region": request.region,
                "ingredients": request.ingredients,
                "retry_count": retry_count
            })
            
            # Check if recipe is too similar to sources
            if result.get("is_similar", False) and retry_count < max_retries:
                retry_count += 1
                novelty_message = "Got something similar, making it wildly novel..."
                continue
            else:
                break
        
        # Format sources for frontend
        sources = []
        for doc in result.get("context", []):
            sources.append({
                "title": doc.metadata.get("title", "Unknown"),
                "region": doc.metadata.get("region", "Unknown"),
                "preview": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content
            })
        
        return RecipeResponse(
            recipe=result.get("answer", ""),
            sources=sources,
            status="success",
            retry_count=retry_count,
            novelty_message=novelty_message
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recipe: {str(e)}")

@app.post("/ask")
async def ask_endpoint(request: RecipeRequest):
    """Alternative endpoint matching your original ask function"""
    return await generate_recipe(request)

@app.get("/novelty-status/{retry_count}")
async def get_novelty_status(retry_count: int):
    """Endpoint to get novelty status message for frontend polling"""
    if retry_count > 0:
        return {"message": "Got something similar, making it wildly novel...", "processing": True}
    return {"message": "", "processing": False}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)