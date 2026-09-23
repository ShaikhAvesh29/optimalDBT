import pulp

# The Regulatory Knowledge Graph
SCHEMES_DB = {
    "PM_KISAN":           {"value": 6000,   "friction": 200,  "income_limit": 800000},
    "STATE_INPUT_GRANT":  {"value": 8000,   "friction": 500,  "income_limit": 500000},
    "PM_KUSUM_SOLAR":     {"value": 60000,  "friction": 2500, "income_limit": float('inf')},
    "SMAM_TRACTOR":       {"value": 85000,  "friction": 4000, "income_limit": float('inf')},
    "AIF_INFRA_LOAN":     {"value": 15000,  "friction": 1200, "income_limit": 1000000}
}

CONFLICT_EDGES = [
    ("PM_KISAN", "STATE_INPUT_GRANT"),
    ("PM_KUSUM_SOLAR", "SMAM_TRACTOR")
]

def solve_optimal_bundle(applicant_income: float):
    prob = pulp.LpProblem("Subsidy_Yield", pulp.LpMaximize)
    x = pulp.LpVariable.dicts("Select", SCHEMES_DB.keys(), cat='Binary')

    # Objective
    prob += pulp.lpSum([(SCHEMES_DB[s]["value"] - SCHEMES_DB[s]["friction"]) * x[s] for s in SCHEMES_DB])

    # Constraints
    for s_name, s_data in SCHEMES_DB.items():
        if applicant_income > s_data["income_limit"]:
            prob += x[s_name] == 0

    for edge in CONFLICT_EDGES:
        prob += x[edge[0]] + x[edge[1]] <= 1

    # Solve
    prob.solve(pulp.PULP_CBC_CMD(msg=False))

    # Format the Output for the Frontend
    selected_schemes = []
    total_yield = 0
    total_friction = 0

    for v in prob.variables():
        if v.varValue == 1.0:
            scheme_id = v.name.replace("Select_", "")
            selected_schemes.append(scheme_id)
            total_yield += SCHEMES_DB[scheme_id]["value"]
            total_friction += SCHEMES_DB[scheme_id]["friction"]

    return {
        "status": "success",
        "applicant_income": applicant_income,
        "optimized_portfolio": selected_schemes,
        "metrics": {
            "max_theoretical_payout": total_yield,
            "friction_cost": total_friction,
            "net_actionable_capital": total_yield - total_friction
        }
    }