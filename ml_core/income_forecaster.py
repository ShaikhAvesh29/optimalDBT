import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import warnings
warnings.filterwarnings('ignore')

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
    X = df[["land_acres", "cattle", "soil_quality", "current_income"]]
    y = df["next_year_income"]

    # 3. TRAIN THE RANDOM FOREST REGRESSOR
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    print("✅ Model Trained Successfully (Random Forest)")
    return model

def predict_future_income(model, land, cattle, soil, current_income):
    # Format the new applicant's data for the model
    applicant_data = pd.DataFrame({
        "land_acres": [land],
        "cattle": [cattle],
        "soil_quality": [soil],
        "current_income": [current_income]
    })
    
    # 4. RUN THE PREDICTION
    predicted_income = model.predict(applicant_data)[0]
    return predicted_income

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