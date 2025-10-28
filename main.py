# 1. Import necessary libraries
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # Important for frontend connection
# import dotenv # Uncomment if using python-dotenv for API key

# --- Configuration ---
# BEST PRACTICE: Load API key from environment variable
# dotenv.load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
# --- OR ---
# For quick testing (replace with your actual key):


if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Please set it as an environment variable or in the script.")

# 2. Configure the Google AI SDK
try:
    genai.configure(api_key=API_KEY)
except Exception as e:
    print(f"❌ Error configuring Gemini API: {e}")
    # Exit if configuration fails - essential for the app to work
    exit()

# 3. Initialize the Gemini Model
try:
    # Using gemini-1.0-pro, suitable for the free tier
    # NEW CODE (Correct model name)
    # --- TRY THIS 1.5 MODEL ---
    # --- TRY THIS 2.5 MODEL ---
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
    "null",                      # Allow requests from 'null' origin (when opening index.html directly)
    # Add your Netlify URL if you want to test the deployed frontend with this local backend
    # "https://your-netlify-app-name.netlify.app",
]

# 6. Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # List of origins allowed to make requests
    allow_credentials=True,      # Allow cookies (not strictly needed here, but good practice)
    allow_methods=["*"],         # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # Allow all headers
)
# --- End CORS ---

# 7. Define the structure of the incoming request data
class PromptRequest(BaseModel):
    prompt: str # Expecting a JSON like {"prompt": "user message"}

# 8. Define the API endpoint to handle chat requests
@app.post("/generate")
async def generate_response(request: PromptRequest):
    user_prompt = request.prompt
    
    # Basic validation
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    print(f"➡️ Received Prompt: {user_prompt}") # Log received prompt

    try:
        # 9. Send the prompt to the Gemini model
        response = model.generate_content(user_prompt)

        # 10. IMPORTANT: Check if the response has content
        # Sometimes the model might not return text due to safety filters etc.
        if not response.parts:
             safety_feedback = response.prompt_feedback if hasattr(response, 'prompt_feedback') else "No content generated."
             print(f"⚠️ Gemini Warning: {safety_feedback}")
             # Provide a safe fallback response to the user
             ai_reply = "Sorry, I couldn't generate a response for that. Maybe try rephrasing?"
        else:
            # 11. Extract the text response
             ai_reply = response.text

        print(f"⬅️ Sending Reply: {ai_reply}") # Log the reply being sent
        # 12. Return the response in JSON format
        return {"reply": ai_reply}

    except Exception as e:
        # 13. Handle potential errors during the API call
        print(f"❌ Error calling Gemini API: {e}") # Log the specific error
        raise HTTPException(status_code=500, detail="Internal server error: Could not get response from AI model.")

# Optional: Root endpoint for basic check
@app.get("/")
def read_root():
    return {"message": "Vibra AI Backend is running!"}

# --- How to Run ---
# 1. Save this code as 'main.py'
# 2. Make sure you have FastAPI, Uvicorn, and google-generativeai installed:
#    pip install fastapi uvicorn google-generativeai python-dotenv
# 3. Replace "YOUR_GEMINI_API_KEY" with your actual key (or set it as an environment variable)
# 4. Run the server from your terminal: uvicorn main:app --reload

#    (The server will likely run on http://127.0.0.1:8000)

