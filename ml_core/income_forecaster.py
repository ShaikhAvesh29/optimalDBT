import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
import warnings
import json
import os
from datetime import datetime
warnings.filterwarnings('ignore')

# --- LOGGING SETUP ---
LOG_FILE = os.path.join(os.path.dirname(__file__), "ml_predictions.log")

def _log_record(event: str, payload: dict):
    """Appends a structured JSON record to the prediction log file."""
    record = {
        "timestamp": datetime.now().isoformat(),
        "event": event,
        **payload
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(f"[LOG] {event}: {json.dumps(payload, ensure_ascii=False)}")

def train_income_predictor():
    print("[ML MODULE] Booting Scikit-Learn Predictive Routing Engine...")
    
    # 1. GENERATE SYNTHETIC HISTORICAL DATA (The Training Set)
    # Features: Land Size (Acres), Cattle Owned, Soil Quality (1-10), Current Income
    # Target: Next Year's Income
    data = {
        "land_acres": [2.5, 5.0, 1.2, 10.0, 3.5, 0.5, 8.0, 4.2],
        "cattle": [2, 5, 0, 12, 3, 1, 8, 4],
        "soil_quality": [6, 8, 4, 9, 7, 3, 8, 6],
        "current_income": [120000, 350000, 80000, 800000, 250000, 50000, 600000, 300000],
        "next_year_income": [135000, 380000, 82000, 850000, 270000, 51000, 640000, 315000] # Target Variable
    }
    df = pd.DataFrame(data)

    # 2. SPLIT FEATURES (X) AND TARGET (y)
    FEATURES = ["land_acres", "cattle", "soil_quality", "current_income"]
    X = df[FEATURES]
    y = df["next_year_income"]

    # 3. TRAIN THE RANDOM FOREST REGRESSOR
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # 4. RECORD TRAINING METRICS
    cv_scores = cross_val_score(model, X, y, cv=3, scoring="r2")
    feature_importances = dict(zip(FEATURES, [round(float(v), 4) for v in model.feature_importances_]))
    training_metrics = {
        "n_estimators": 100,
        "n_samples": len(df),
        "cv_r2_scores": [round(float(s), 4) for s in cv_scores],
        "mean_cv_r2": round(float(cv_scores.mean()), 4),
        "feature_importances": feature_importances,
    }
    _log_record("MODEL_TRAINED", training_metrics)
    print(f"[OK] Model Trained Successfully (Random Forest) | Mean CV R²: {training_metrics['mean_cv_r2']}")
    return model

def predict_future_income(model, land, cattle, soil, current_income):
    """Runs a Random Forest income forecast and records every call to the log."""
    # Format the new applicant's data for the model
    applicant_data = pd.DataFrame({
        "land_acres": [land],
        "cattle": [cattle],
        "soil_quality": [soil],
        "current_income": [current_income]
    })
    
    # RUN THE PREDICTION
    predicted_income = float(model.predict(applicant_data)[0])

    # RECORD THE INFERENCE
    breach_risk = predicted_income > 500000
    _log_record("INCOME_PREDICTED", {
        "inputs": {
            "land_acres": land,
            "cattle": cattle,
            "soil_quality": soil,
            "current_income": current_income
        },
        "predicted_next_year_income": round(predicted_income, 2),
        "breach_risk": breach_risk,
        "routing_flag": "REROUTE_TO_CENTRAL" if breach_risk else "SAFE"
    })

    return predicted_income


def record_income_submission(farmer_name: str, state: str, land_acres: float,
                             cattle: int, soil_quality: int, annual_income: float) -> dict:
    """
    Records a farmer's manually submitted income data to the log.
    Called by the /record-income API endpoint.
    """
    record_id = f"FRM-{datetime.now().strftime('%Y%m%d%H%M%S%f')[:18]}"
    payload = {
        "record_id": record_id,
        "farmer_name": farmer_name,
        "state": state,
        "land_acres": land_acres,
        "cattle": cattle,
        "soil_quality": soil_quality,
        "annual_income": annual_income,
    }
    _log_record("INCOME_SUBMITTED", payload)
    return {"record_id": record_id, **payload}

# --- HACKATHON DEMO EXECUTION ---
if __name__ == "__main__":
    # Train the model (happens instantly for this small dataset)
    trained_rf_model = train_income_predictor()
    
    # Simulate a new farmer applying today
    demo_farmer = {
        "land": 3.0,
        "cattle": 2,
        "soil": 7,
        "current_income": 200000
    }
    
    print("\n--- RUNNING PREDICTIVE FORECAST ---")
    print(f"Farmer's Current Income: ₹{demo_farmer['current_income']:,.2f}")
    
    forecasted_income = predict_future_income(
        trained_rf_model, 
        demo_farmer["land"], 
        demo_farmer["cattle"], 
        demo_farmer["soil"], 
        demo_farmer["current_income"]
    )
    
    print(f"🤖 ML Forecast for Next Year: ₹{forecasted_income:,.2f}")
    
    # Connect this to your Temporal Agent Logic
    if forecasted_income > 500000:
        print("⚠️ WARNING: Predicted income breaches State Grant limits next year. Rerouting to Central Schemes.")
    else:
        print("✅ SAFE: Farmer will remain eligible for current schemes next year.")