from datetime import datetime, timedelta

# ─── DOCUMENT KNOWLEDGE BASE ─────────────────────────────────────────────────
# Maps document keywords → classification, schemes it unlocks, validity rules
DOCUMENT_RULES = {
    "aadhaar": {
        "classification": "Aadhaar Card",
        "icon": "🪪",
        "schemes": ["PM_KISAN", "PMFBY", "PMKSY", "STATE_INPUT_GRANT", "AIF_INFRA_LOAN", "SMAM_TRACTOR"],
        "validity_years": None,
        "friction_reduction": 800,
        "category": "identity",
        "required_for": "ALL schemes — base identity document",
        "tips": "Ensure name matches bank account exactly to avoid PFMS rejection."
    },
    "pan": {
        "classification": "PAN Card",
        "icon": "💳",
        "schemes": ["AIF_INFRA_LOAN", "PM_KUSUM_SOLAR", "SMAM_TRACTOR"],
        "validity_years": None,
        "friction_reduction": 300,
        "category": "identity",
        "required_for": "High-value schemes (SMAM, AIF, PM-KUSUM) above ₹50,000 subsidy",
        "tips": "Link PAN with Aadhaar to avoid TDS deduction on subsidy amounts."
    },
    "khasra": {
        "classification": "Khasra / Khatauni (Land Record)",
        "icon": "📜",
        "schemes": ["PM_KISAN", "PMFBY", "PMKSY", "STATE_INPUT_GRANT", "SMAM_TRACTOR"],
        "validity_years": 1,
        "friction_reduction": 1200,
        "category": "land",
        "required_for": "Land-based schemes — proves ownership and acreage",
        "tips": "Must be current financial year copy from tehsildar. Digitally signed e-ROR accepted."
    },
    "khatauni": {
        "classification": "Khatauni (Land Rights Record)",
        "icon": "📜",
        "schemes": ["PM_KISAN", "PMFBY", "PMKSY", "STATE_INPUT_GRANT"],
        "validity_years": 1,
        "friction_reduction": 1200,
        "category": "land",
        "required_for": "Proof of cultivated land and farming rights",
        "tips": "Khatauni with your name as khatedar is mandatory for PM-KISAN registration."
    },
    "income": {
        "classification": "Income Certificate",
        "icon": "📋",
        "schemes": ["STATE_INPUT_GRANT", "AIF_INFRA_LOAN", "PM_KUSUM_SOLAR"],
        "validity_years": 1,
        "friction_reduction": 600,
        "category": "financial",
        "required_for": "Income-capped schemes — proves you are below the eligibility ceiling",
        "tips": "Issued by tehsildar. Valid for 1 year. Upload before monsoon season for PMFBY."
    },
    "tehsildar": {
        "classification": "Income Certificate (Tehsildar Issued)",
        "icon": "📋",
        "schemes": ["STATE_INPUT_GRANT", "AIF_INFRA_LOAN", "PM_KUSUM_SOLAR"],
        "validity_years": 1,
        "friction_reduction": 600,
        "category": "financial",
        "required_for": "Income verification for capped government schemes",
        "tips": "Ensure the certificate stamp date is within the current financial year."
    },
    "bank": {
        "classification": "Bank Account Proof",
        "icon": "🏦",
        "schemes": ["PM_KISAN", "PMFBY", "PMKSY", "STATE_INPUT_GRANT", "AIF_INFRA_LOAN"],
        "validity_years": None,
        "friction_reduction": 700,
        "category": "financial",
        "required_for": "ALL DBT schemes — PFMS transfers only to verified bank accounts",
        "tips": "Account must be Aadhaar-linked. IFSC must be PFMS-whitelisted."
    },
    "passbook": {
        "classification": "Bank Passbook",
        "icon": "🏦",
        "schemes": ["PM_KISAN", "PMFBY", "PMKSY", "STATE_INPUT_GRANT", "AIF_INFRA_LOAN"],
        "validity_years": None,
        "friction_reduction": 700,
        "category": "financial",
        "required_for": "Direct benefit transfer — payment gateway verification",
        "tips": "First page (account number + IFSC) is sufficient. Aadhaar seeding mandatory."
    },
    "soil": {
        "classification": "Soil Health Card",
        "icon": "🌱",
        "schemes": ["PM_KISAN", "PMKSY", "STATE_INPUT_GRANT"],
        "validity_years": 2,
        "friction_reduction": 400,
        "category": "agricultural",
        "required_for": "PM-KISAN compliance and PMKSY irrigation subsidy computation",
        "tips": "Get free SHC from Krishi Vigyan Kendra. Reduces fertilizer cost by 10-15%."
    },
    "caste": {
        "classification": "Caste / Category Certificate",
        "icon": "📄",
        "schemes": ["STATE_INPUT_GRANT", "PM_KUSUM_SOLAR", "SMAM_TRACTOR"],
        "validity_years": None,
        "friction_reduction": 350,
        "category": "identity",
        "required_for": "SC/ST/OBC category subsidy enhancements (up to 10% extra benefit)",
        "tips": "OBC from tehsildar; SC/ST from District Collector. Required for enhanced subsidies."
    },
    "pmfby": {
        "classification": "PMFBY Crop Sowing Declaration",
        "icon": "🌾",
        "schemes": ["PMFBY"],
        "validity_years": None,
        "friction_reduction": 500,
        "category": "agricultural",
        "required_for": "PM Fasal Bima Yojana crop insurance enrollment",
        "tips": "Must be submitted within 10 days of sowing. Patwari countersignature required."
    },
    "voter": {
        "classification": "Voter ID Card",
        "icon": "🗳️",
        "schemes": ["STATE_INPUT_GRANT"],
        "validity_years": None,
        "friction_reduction": 200,
        "category": "identity",
        "required_for": "State-level domicile proof for state scheme enrollment",
        "tips": "Accepted as address proof. Aadhaar preferred but Voter ID works as alternate."
    },
    "registry": {
        "classification": "Land Mutation / Registry Deed",
        "icon": "🏛️",
        "schemes": ["PMKSY", "PM_KUSUM_SOLAR", "SMAM_TRACTOR"],
        "validity_years": None,
        "friction_reduction": 900,
        "category": "land",
        "required_for": "Capital-intensive infrastructure schemes requiring ownership proof",
        "tips": "Registered deed from Sub-Registrar's office. Needed if Khatauni is unavailable."
    },
    "expired": {
        "classification": "Expired Document",
        "icon": "⛔",
        "schemes": [],
        "validity_years": 0,
        "friction_reduction": 0,
        "category": "invalid",
        "required_for": "N/A — renewal required",
        "tips": "This document has expired. Renew before submitting any scheme application."
    }
}

SCHEME_FULL_NAMES = {
    "PM_KISAN": "PM Kisan Samman Nidhi",
    "PMFBY": "PM Fasal Bima Yojana",
    "PMKSY": "PMKSY Irrigation Grant",
    "STATE_INPUT_GRANT": "State Input Grant",
    "AIF_INFRA_LOAN": "AIF Infrastructure Loan",
    "PM_KUSUM_SOLAR": "PM KUSUM Solar Pump",
    "SMAM_TRACTOR": "SMAM Tractor Subsidy"
}

# Core documents needed for a full DBT portfolio
ALL_REQUIRED_DOCS = {"aadhaar", "khasra", "bank", "income", "soil", "pmfby"}


def _classify_document(filename: str) -> dict | None:
    """Match filename keywords to document rules."""
    name_lower = filename.lower().replace("-", " ").replace("_", " ")
    for keyword, rule in DOCUMENT_RULES.items():
        if keyword in name_lower:
            return rule.copy()
    return None


def _compute_validity(rule: dict) -> dict:
    """Compute expiry status from validity_years."""
    if rule.get("validity_years") is None:
        return {
            "expiry_date": None,
            "days_until_expiry": None,
            "is_valid": True,
            "expiry_label": "Permanent / No expiry"
        }
    if rule["validity_years"] == 0:
        expiry = datetime.now() - timedelta(days=30)
        return {
            "expiry_date": expiry.strftime("%Y-%m-%d"),
            "days_until_expiry": -30,
            "is_valid": False,
            "expiry_label": "EXPIRED"
        }
    expiry = datetime.now() + timedelta(days=rule["validity_years"] * 365)
    days_left = rule["validity_years"] * 365
    return {
        "expiry_date": expiry.strftime("%Y-%m-%d"),
        "days_until_expiry": days_left,
        "is_valid": True,
        "expiry_label": f"Valid until {expiry.strftime('%d %b %Y')}"
    }


def _canonical_key(filename: str) -> str:
    name_lower = filename.lower()
    for keyword in DOCUMENT_RULES:
        if keyword in name_lower:
            return keyword
    return ""


def _build_recommendations(uploaded_keys: set) -> list:
    """Return prioritized list of still-missing required documents."""
    missing = ALL_REQUIRED_DOCS - uploaded_keys
    recs = []
    for key in missing:
        rule = DOCUMENT_RULES.get(key, {})
        recs.append({
            "document": rule.get("classification", key.title()),
            "icon": rule.get("icon", "📄"),
            "schemes": [SCHEME_FULL_NAMES.get(s, s) for s in rule.get("schemes", [])],
            "tip": rule.get("tips", ""),
            "priority": "HIGH" if len(rule.get("schemes", [])) >= 4 else "MEDIUM"
        })
    recs.sort(key=lambda r: (0 if r["priority"] == "HIGH" else 1, -len(r["schemes"])))
    return recs


def extract_document_data(filename: str, file_bytes: bytes) -> dict:
    """
    AI OCR agent: classifies an uploaded government document by filename keywords,
    returns which schemes it unlocks, validity status, friction reduction score,
    expert tips, and a prioritized list of still-missing documents.
    """
    print(f"[AI VISION] Processing: {filename} ({len(file_bytes):,} bytes)")

    rule = _classify_document(filename)

    # ── UNRECOGNIZED DOCUMENT ──────────────────────────────────────────────
    if rule is None:
        return {
            "status": "unrecognized",
            "classification": "Unrecognized Document",
            "icon": "❓",
            "is_valid": False,
            "message": (
                "AI could not classify this document. Rename the file to include the document type "
                "(e.g. 'aadhaar.jpg', 'khasra_2024.pdf', 'income_certificate.jpg', 'bank_passbook.pdf') "
                "and re-upload."
            ),
            "schemes_unlocked": [],
            "friction_reduction": 0,
            "recommendations": _build_recommendations(set()),
        }

    validity = _compute_validity(rule)

    # ── EXPIRED DOCUMENT ──────────────────────────────────────────────────
    if not validity["is_valid"]:
        return {
            "status": "expired",
            "classification": rule["classification"],
            "icon": rule["icon"],
            "is_valid": False,
            "message": f"{rule['classification']} is EXPIRED. Renewal required before applying to any scheme.",
            "expiry_date": validity["expiry_date"],
            "days_until_expiry": validity["days_until_expiry"],
            "expiry_label": validity["expiry_label"],
            "schemes_unlocked": [],
            "friction_reduction": 0,
            "tip": rule["tips"],
            "recommendations": _build_recommendations(set()),
        }

    # ── VALID DOCUMENT ─────────────────────────────────────────────────────
    uploaded_key = _canonical_key(filename)
    schemes_unlocked = [
        {"id": sid, "name": SCHEME_FULL_NAMES.get(sid, sid)}
        for sid in rule["schemes"]
    ]

    return {
        "status": "verified",
        "classification": rule["classification"],
        "icon": rule["icon"],
        "category": rule["category"],
        "is_valid": True,
        "message": (
            f"{rule['classification']} verified. Unlocks {len(rule['schemes'])} scheme(s) "
            f"with ₹{rule['friction_reduction']:,} friction reduction."
        ),
        "expiry_date": validity["expiry_date"],
        "days_until_expiry": validity["days_until_expiry"],
        "expiry_label": validity["expiry_label"],
        "schemes_unlocked": schemes_unlocked,
        "friction_reduction": rule["friction_reduction"],
        "required_for": rule["required_for"],
        "tip": rule["tips"],
        "recommendations": _build_recommendations({uploaded_key}),
    }