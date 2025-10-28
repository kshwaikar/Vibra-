# 1. Import necessary libraries
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # Important for frontend connection
# import dotenv # Uncomment if using python-dotenv for API key

# --- Configuration ---
# BEST PRACTICE: Load API key from environment variable
# Use Render's environment variable setting instead of dotenv on the server
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Please set it as an environment variable in your hosting service (e.g., Render).")

# 2. Configure the Google AI SDK
try:
    genai.configure(api_key=API_KEY)
except Exception as e:
    print(f"❌ Error configuring Gemini API: {e}")
    exit()

# 3. Initialize the Gemini Model
try:
    # Using gemini-2.5-pro as requested (ensure your key has access)
    model = genai.GenerativeModel('gemini-2.5-pro')
except Exception as e:
    print(f"❌ Error initializing Gemini model: {e}")
    exit()

# 4. Create FastAPI application instance
app = FastAPI()

# --- CORS Middleware ---
# 5. Define allowed origins (where your frontend is running)
origins = [
    "http://localhost",          # Allow requests from local file server
    "http://127.0.0.1",          # Common alias for localhost
    "null",                      # Allow requests from 'null' origin (opening index.html directly)
    "https://vibramindtracker.netlify.app", # <<< YOUR NETLIFY URL ADDED HERE
    # You might not strictly need the backend URL here, but it doesn't hurt
    # "https://vibra-j5e1.onrender.com" 
]

# 6. Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # List of origins allowed
    allow_credentials=True,             # Allow cookies (optional but good practice)
    allow_methods=["GET", "POST", "OPTIONS"], # <<< EXPLICITLY ALLOW METHODS
    allow_headers=["Content-Type", "Authorization"], # <<< EXPLICITLY ALLOW HEADERS (Content-Type needed for POST)
    # Using ["*"] should also work, but being explicit can sometimes help debugging
    # allow_methods=["*"], 
    # allow_headers=["*"], 
)
# --- End CORS ---

# 7. Define the structure of the incoming request data
class PromptRequest(BaseModel):
    prompt: str # Expecting a JSON like {"prompt": "user message"}

# 8. Define the API endpoint to handle chat requests
@app.post("/generate")
async def generate_response(request: PromptRequest):
    user_prompt = request.prompt
    
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    print(f"➡️ Received Prompt: {user_prompt}") 

    try:
        # 9. Send the prompt to the Gemini model
        response = model.generate_content(user_prompt)

        # 10. Check if the response has content
        if not response.parts:
             safety_feedback = response.prompt_feedback if hasattr(response, 'prompt_feedback') else "No content generated."
             print(f"⚠️ Gemini Warning: {safety_feedback}")
             ai_reply = "Sorry, I couldn't generate a response for that. Maybe try rephrasing?"
        else:
            # 11. Extract the text response
             ai_reply = response.text

        print(f"⬅️ Sending Reply: {ai_reply}") 
        # 12. Return the response in JSON format
        return {"reply": ai_reply}

    except Exception as e:
        # 13. Handle potential errors during the API call
        print(f"❌ Error calling Gemini API: {e}") 
        raise HTTPException(status_code=500, detail="Internal server error: Could not get response from AI model.")

# Optional: Root endpoint for basic check
@app.get("/")
def read_root():
    return {"message": "Vibra AI Backend is running!"}

# --- How to Run (Locally) ---
# 1. Save this code as 'main.py'
# 2. Install requirements: pip install fastapi uvicorn google-generativeai python-dotenv packaging
# 3. Set GEMINI_API_KEY environment variable (or hardcode temporarily for local test)
# 4. Run: uvicorn main:app --reload 
# --- Deployment (Render) ---
# 1. Ensure requirements.txt exists in repo.
# 2. Set GEMINI_API_KEY in Render's Environment Variables.
# 3. Build Command: pip install -r requirements.txt
# 4. Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
