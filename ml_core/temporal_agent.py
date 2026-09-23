def simulate_windfall_impact(scheme_id: str, base_income: float, windfall_amount: float):
    """
    Simulates if a sudden income spike disqualifies a farmer from a specific scheme 
    for the current year or the entire tenure.
    """
    total_current_year_income = base_income + windfall_amount
    
    # --- MOCK GOVERNMENT POLICY DATABASE ---
    # Different schemes have different legal definitions of "Income"
    policy_rules = {
        "PM_KISAN": {
            "income_limit": 800000,
            "rule_type": "strict_annual", 
            "description": "Strict yearly cutoff. Breaching it suspends payout for that specific year only."
        },
        "AIF_INFRA_LOAN": {
            "income_limit": 1000000,
            "rule_type": "tenure_average",
            "tenure_years": 3,
            "description": "Looks at the 3-year average income. A one-time spike might be absorbed."
        },
        "STATE_INPUT_GRANT": {
            "income_limit": 500000,
            "rule_type": "permanent_void",
            "description": "If income ever crosses the threshold, the beneficiary is permanently removed from the registry."
        }
    }

    if scheme_id not in policy_rules:
        return {"status": "Unknown Scheme", "risk_level": "Unknown"}

    rule = policy_rules[scheme_id]
    limit = rule["income_limit"]
    
    # --- EVALUATION LOGIC ---
    result = {
        "scheme": scheme_id,
        "total_calculated_income": total_current_year_income,
        "limit": limit
    }

    # Logic 1: Strict Annual Check (Temporary Suspension)
    if rule["rule_type"] == "strict_annual":
        if total_current_year_income > limit:
            result["risk_level"] = "HIGH - TEMPORARY SUSPENSION"
            result["verdict"] = "You are disqualified FOR THIS FINANCIAL YEAR ONLY. Do not cancel your registration; payouts will resume next year if your base income drops."
        else:
            result["risk_level"] = "SAFE"
            result["verdict"] = "Income remains within legal limits."

    # Logic 2: Tenure Average Check (Absorbing the shock)
    elif rule["rule_type"] == "tenure_average":
        # Calculate: (Base Year 1 + Base Year 2 + Base Year 3 + Windfall) / 3
        projected_3_year_avg = ((base_income * 3) + windfall_amount) / rule["tenure_years"]
        result["total_calculated_income"] = projected_3_year_avg
        
        if projected_3_year_avg > limit:
            result["risk_level"] = "HIGH - TENURE DISQUALIFICATION"
            result["verdict"] = f"Even spread across {rule['tenure_years']} years, this windfall breaches the limit. You will lose this loan subsidy."
        else:
            result["risk_level"] = "SAFE - SHOCK ABSORBED"
            result["verdict"] = f"Because this scheme averages income over {rule['tenure_years']} years, the one-time spike is absorbed. You REMAIN ELIGIBLE for the whole tenure."

    # Logic 3: Permanent Void (The Disqualification Cascade)
    elif rule["rule_type"] == "permanent_void":
        if total_current_year_income > limit:
            result["risk_level"] = "CRITICAL - PERMANENT VOID"
            result["verdict"] = "WARNING: Claiming this windfall will permanently strike your name from the State Registry. We recommend rerouting to Scheme B immediately."
        else:
            result["risk_level"] = "SAFE"
            result["verdict"] = "Income remains within legal limits."

    return result
def simulate_windfall_impact(scheme_id: str, base_income: float, windfall_amount: float):
    # Add this line to force uppercase
    scheme_id = scheme_id.upper() 
    
    # ... rest of your code stays the same