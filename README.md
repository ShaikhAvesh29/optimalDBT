# OptimalDBT (योजना सुदृढ़ीकरण मंच)
**Next-Generation Multi-Period Direct Benefit Transfer (DBT) Maximization Engine for Indian Agriculture**

OptimalDBT is an automated financial routing and advisory platform engineered for Village-Level Entrepreneurs (VLEs) and smallholder farmers. By combining **Multi-Period Integer Linear Programming (MP-ILP)**, **predictive income modeling**, and **multilingual generative advisory** via Google Gemini 1.5 Flash, the platform eliminates mutual-exclusion disqualification penalties and maximizes actionable fiscal yield across Central and State government schemes.

---

## 📌 Problem Statement

Indian agricultural beneficiaries face severe systemic hurdles when accessing government welfare:
1. **The Disqualification Trap (Mutual Exclusion):** Applying for overlapping Central and State schemes (e.g., central solar subsidies vs. state tubewell grants) can trigger audit flags, clawbacks, or permanent disqualification.
2. **Sub-optimal Fiscal Routing:** Beneficiaries frequently opt for lower-yield, high-friction schemes simply due to localized awareness gaps.
3. **Linguistic & Documentation Barriers:** Complex official vernacular and opaque verification requirements prevent eligible marginal farmers from accessing capital.

OptimalDBT models policy guidelines as a mathematical optimization problem to yield an exact, conflict-free portfolio with zero bureaucratic overlap.

---

## ⚡ Core Architecture

```text
                    ┌────────────────────────────────────────┐
                    │      React / Vite Frontend Portal      │
                    │   (VLE Operator & Beneficiary Modes)   │
                    └───────────────────┬────────────────────┘
                                        │ JSON Payloads
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    FastAPI Microservice (ml_core)                          │
├─────────────────────┬──────────────────────┬───────────────────────────────┤
│    MP-ILP Solver    │   Predictive Model   │       Advisory Engine         │
│     (PuLP / CBC)    │    (Scikit-Learn)    │     (Gemini 1.5 Flash)        │
│                     │                      │                               │
│ • Conflict Graphs   │ • 5-Yr Asset Yield   │ • Hindi/English Dialects      │
│ • Income Thresholds │ • Cliff Detection    │ • Context-Injected Prompts    │
│ • Net Capital Yield │ • Windfall Sim       │ • Document Rule Explanations  │
└─────────────────────┴──────────────────────┴───────────────────────────────┘
```

---

## 🧮 Mathematical Formulation (MP-ILP Solver)

The selection pipeline solves an **Integer Linear Programming** problem using the Branch-and-Cut (CBC) solver:

### 1. Objective Function
Maximize the net actionable capital across all candidate schemes $S$, discounted by procedural documentation friction:

$$\max \sum_{i \in S} \left( \text{Benefit}_i \cdot x_i - \text{Friction}_i \cdot x_i \right)$$

where:
* $x_i \in \{0, 1\}$ is the binary decision variable denoting scheme inclusion.
* $\text{Benefit}_i$ is the annualized direct transfer value in INR (₹).
* $\text{Friction}_i$ is the operational cost derived from document requirements and verification latency.

### 2. Constraints
* **Income Ceiling:** Disqualifies applicants exceeding asset or income thresholds:
  $$x_i \cdot \text{AnnualIncome} \le \text{Threshold}_i \quad \forall i \in S$$
* **Landholding Eligibility:** Restricts land-size bound initiatives (e.g., marginal/small farmer bounds):
  $$x_i \cdot \text{TotalAcreage} \le \text{MaxLand}_i \quad \forall i \in S$$
* **Mutual Exclusion (Conflict Graph Resolution):** For any subset of schemes $K \subset S$ sharing duplicate fiscal utility (e.g., component solar equipment):
  $$\sum_{j \in K} x_j \le 1$$

---

## 🚀 Key Features

* **Multi-Period Scheme Optimization (`/optimize`):** Solves policy conflict graphs in $<120\text{ms}$ to output optimal, conflict-free portfolios (e.g., ₹4,07,000/year target yield).
* **Multilingual AI Advisory (`/voice-assistant`):** Context-aware, vernacular advisory powered by Google Gemini 1.5 Flash supporting English, Hindi, and regional dialects.
* **Temporal Income Forecasting (`/predict-future-income`):** Random Forest regressors predict 5-year agricultural earnings based on soil profile, cattle count, and acreage to avoid welfare cliff disqualifications.
* **Document Friction Classifier (`/upload-document`):** Evaluates applicant credentials (Aadhaar, 7/12 Land Records, Khatauni) and dynamically sets friction penalties to zero upon automated verification.
* **Field Agent Pre-Authentication Mode:** Rapid bypass architecture for Village-Level Entrepreneurs (VLE) operating under high transaction volume.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Web Speech API |
| **Backend Engine** | FastAPI, Uvicorn, Pydantic V2 |
| **Optimization** | PuLP (Coin-or Branch and Cut - CBC Solver) |
| **Machine Learning** | Scikit-Learn (Random Forest Regressor, Pipeline) |
| **LLM & Vision** | Google Gemini 1.5 Flash (`google-generativeai`) |

---

## 💻 Local Setup & Installation

### Prerequisites
* Python 3.10+
* Node.js 18+ & npm
* Google Gemini API Key

---

### 1. Backend Setup (`ml_core`)

```powershell
cd ml_core
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn pulp scikit-learn google-generativeai python-dotenv
```

Add your Gemini API key in `ml_core/.env`:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

Start the FastAPI server:
```powershell
uvicorn main:app --reload --port 8000
```
*API documentation will run at `http://127.0.0.1:8000/docs`.*

---

### 2. Frontend Setup

From the root repository folder:
```powershell
npm install
npm run dev
```
*The portal will boot at `http://localhost:3000/`.*

```
