from datetime import datetime, timedelta

def extract_document_data(filename: str, file_bytes: bytes):
    """
    In a production environment, this passes file_bytes to an OCR/Vision API.
    For the hackathon demo, we use heuristic keyword matching on the filename 
    to simulate the AI's classification and extraction process.
    """
    print(f"[AI VISION] Processing uploaded document: {filename}...")
    
    # Simulated AI Extraction Logic
    filename_lower = filename.lower()
    
    doc_info = {
        "classification": "Unknown",
        "extracted_date": None,
        "is_valid": False,
        "days_until_expiry": 0,
        "friction_reduction": 0,
        "status_message": ""
    }

    # Simulate detecting an Income Certificate
    if "income" in filename_lower or "tehsildar" in filename_lower:
        doc_info["classification"] = "Income Certificate"
        doc_info["friction_reduction"] = 500  # Reduces the friction score of schemes requiring this
        
        # Simulate an expiration date 45 days from today
        simulated_expiry = datetime.now() + timedelta(days=45)
        doc_info["extracted_date"] = simulated_expiry.strftime("%Y-%m-%d")
        doc_info["days_until_expiry"] = 45
        doc_info["is_valid"] = True
        doc_info["status_message"] = "✅ Valid: Income verified. Friction penalty removed."

    # Simulate detecting an EXPIRED Aadhaar/Land Registry
    elif "registry" in filename_lower or "expired" in filename_lower:
        doc_info["classification"] = "Land Mutation Registry"
        
        # Simulate an expiration date 10 days in the past
        simulated_expiry = datetime.now() - timedelta(days=10)
        doc_info["extracted_date"] = simulated_expiry.strftime("%Y-%m-%d")
        doc_info["days_until_expiry"] = -10
        doc_info["is_valid"] = False
        doc_info["status_message"] = "❌ Expired: Document invalid. Friction penalty applies."
        doc_info["friction_reduction"] = 0

    else:
        doc_info["status_message"] = "⚠️ Unrecognized Document Type."

    return doc_info