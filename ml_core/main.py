import sys
import io
# Fix Windows cp1252 encoding crash for Unicode/emoji in print statements
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import os
from dotenv import load_dotenv

# Load env first so API key is available before genai configure
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Use the new google-genai SDK (replaces deprecated google.generativeai)
try:
    from google import genai as google_genai
    genai_client = google_genai.Client(api_key=API_KEY) if API_KEY else None
    GENAI_MODEL = "gemini-2.0-flash"
    USE_NEW_SDK = True
except ImportError:
    import google.generativeai as genai
    if API_KEY:
        genai.configure(api_key=API_KEY)
    USE_NEW_SDK = False

# --- YOUR CUSTOM ML MODULES ---
from core_solver import solve_optimal_bundle
from ocr_agent import extract_document_data
from temporal_agent import simulate_windfall_impact
from income_forecaster import train_income_predictor, predict_future_income, record_income_submission, LOG_FILE

app = FastAPI(title="OptimalDBT Engine API")

# --- 1. HACKATHON LIFESAVER: CORS POLICY ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. PITCH DECK FLEX: TIMING MIDDLEWARE ---
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-ms"] = f"{process_time:.2f}"
    return response

# --- 3. BOOTSTRAP THE ML MODEL ON STARTUP ---
print("Booting Predictive ML Model...")
ml_model = train_income_predictor()

# --- 4. PYDANTIC DATA SCHEMAS (Input Validation) ---
class FarmerProfile(BaseModel):
    name: str
    annual_income: float

class WindfallScenario(BaseModel):
    scheme_id: str
    base_income: float
    windfall_amount: float

class MLForecastRequest(BaseModel):
    land_acres: float
    cattle: int
    soil_quality: int
    current_income: float

# --- 5. THE REST API ENDPOINTS ---
@app.get("/")
def home():
    return {"status": "OptimalDBT Engine API is live. Navigate to /docs for the dashboard."}

@app.post("/optimize")
def get_optimal_portfolio(profile: FarmerProfile):
    """Runs the core MP-ILP constraint solver to find the max yield."""
    return solve_optimal_bundle(applicant_income=profile.annual_income)

@app.post("/upload-document")
async def process_farmer_document(file: UploadFile = File(...)):
    """Simulates OCR extraction and updates the bureaucratic friction matrix."""
    file_bytes = await file.read()
    ai_analysis = extract_document_data(filename=file.filename, file_bytes=file_bytes)
    return {
        "engine_status": "Document Processed", 
        "file_received": file.filename, 
        "ai_vision_results": ai_analysis
    }

@app.post("/simulate-income-spike")
def test_windfall_eligibility(scenario: WindfallScenario):
    """Calculates if a sudden windfall voids a scheme for the year or the whole tenure."""
    analysis = simulate_windfall_impact(
        scheme_id=scenario.scheme_id,
        base_income=scenario.base_income,
        windfall_amount=scenario.windfall_amount
    )
    return {"status": "success", "temporal_analysis": analysis}

@app.post("/predict-future-income")
def predict_income_trajectory(data: MLForecastRequest):
    """
    Passes the farmer's assets into the Scikit-Learn Random Forest model 
    to forecast next year's income and proactively route them.
    """
    forecast = predict_future_income(
        model=ml_model,
        land=data.land_acres,
        cattle=data.cattle,
        soil=data.soil_quality,
        current_income=data.current_income
    )
    
    warning = "SAFE: No expected disqualifications."
    if forecast > 500000:
         warning = "HIGH RISK: Projected to breach State Grant limits next year. Rerouting to Central Schemes recommended."
         
    return {
        "status": "success",
        "current_income": data.current_income,
        "forecasted_income_next_year": forecast,
        "predictive_routing_flag": warning
    }
@app.post("/record-income")
def record_farmer_income(
    farmer_name: str,
    state: str,
    land_acres: float,
    cattle: int,
    soil_quality: int,
    annual_income: float
):
    """
    Records a farmer's manually submitted income data to the audit log.
    Useful for data collection and demo recording.
    """
    record = record_income_submission(
        farmer_name=farmer_name,
        state=state,
        land_acres=land_acres,
        cattle=cattle,
        soil_quality=soil_quality,
        annual_income=annual_income
    )
    return {"status": "recorded", "data": record}

@app.get("/ml-logs")
def get_ml_logs(limit: int = 50):
    """
    Returns the last N records from the ML prediction audit log.
    Great for a live demo — shows every training event, prediction, and submission.
    """
    import json, os
    if not os.path.exists(LOG_FILE):
        return {"status": "no_logs_yet", "records": []}
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()
    records = [json.loads(l) for l in lines[-limit:]]
    return {"status": "ok", "total_records": len(lines), "returned": len(records), "records": records}
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env file! AI features will use fallback responses.")


# --- 6. VOICE ASSISTANT ENDPOINT (wired to ChatPage mic button) ---
class VoiceQuery(BaseModel):
    query: str
    farmer_name: str = "Rajesh Kumar Patel"
    land_acres: float = 4.5
    state: str = "Madhya Pradesh"
    annual_income: float = 140000
    language: str = "en"

@app.post("/voice-assistant")
async def voice_assistant(payload: VoiceQuery):
    """
    Receives a farmer's voice query and returns a Gemini-powered advisory response.
    Wired to the ChatPage mic button on the frontend.
    """
    system_prompt = (
        "You are OptimalDBT AI field assistant helping Indian farmers maximize government DBT benefits.\n"
        f"Farmer: {payload.farmer_name}, {payload.land_acres} acres in {payload.state}, "
        f"income INR {payload.annual_income:,.0f}/yr, language: {payload.language}\n"
        "Give a concise (<120 words) actionable answer focused on eligible schemes and next steps.\n"
        f"Query: {payload.query}"
    )

    ai_text = None
    engine_used = "fallback"

    # Try new google-genai SDK
    if USE_NEW_SDK and genai_client:
        try:
            response = genai_client.models.generate_content(
                model=GENAI_MODEL, contents=system_prompt
            )
            ai_text = response.text.strip()
            engine_used = GENAI_MODEL
        except Exception as e:
            print(f"[WARN] New SDK error: {e}")

    # Final fallback
    if not ai_text:
        ai_text = (
            f"Based on your profile ({payload.land_acres} acres in {payload.state}), "
            f"you may be eligible for PM-KISAN (INR 6,000/yr), PMFBY crop insurance, "
            f"and PMKSY irrigation subsidies. Check the Schemes tab for full details."
        )

    return {
        "status": "success",
        "query": payload.query,
        "ai_response": ai_text,
        "farmer": payload.farmer_name,
        "engine": engine_used
    }