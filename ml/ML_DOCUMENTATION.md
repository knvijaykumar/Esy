# Esy FARM — AI/ML System Technical Documentation

This document provides a comprehensive technical overview of the AI/ML architecture, model pipelines, and FastAPI integration implemented in the **Esy FARM (SIH26032)** procurement platform.

---

## 1. Project Overview

**Esy FARM** is a smart digital procurement and token management platform built to streamline agricultural commodity procurement under the Minimum Support Price (MSP) framework in Karnataka.

### Why AI/ML is Introduced
Traditional procurement centers experience extreme traffic spikes, long physical queues of tractors and bullock carts, and uncertainty regarding market realization versus administrative support prices. AI/ML is integrated to address three specific operational challenges:
1. **Crop Price & Value Trend Estimation:** Providing indicative price trajectories to help farmers and procurement officials gauge market conditions relative to government benchmark rates.
2. **Procurement Slot Demand Forecasting:** Forecasting incoming booking volume across operating windows to prevent physical bottlenecking at centers.
3. **Smart Slot Recommendation:** Guiding farmers toward lower-congestion, high-capacity operating slots without requiring manual scheduling friction.

### Architectural Separation
The ML layer is strictly decoupled from the React user interface and core database transactions. Model inference runs independently as a backend service, communicating via a RESTful FastAPI interface. The UI does not load heavy ML runtimes directly, preserving frontend responsiveness and security.

---

## 2. AI/ML Architecture

```
React Frontend
      ↓ (HTTP JSON Requests)
FastAPI Backend (/api/ml/*)
      ↓
ML API Layer (Request Validation & Response Formatting)
      ↓
ML Modules
 ┌──────────────────────┬─────────────────────────┬────────────────────────┐
 ↓                      ↓                         ↓                        ↓
Price Estimator         Demand Predictor          Slot Recommender         Config & Environment
(ml/price_estimator)    (ml/demand_predictor)     (ml/slot_recommender)    (backend/.env)
 │                      │                         │
 └──► Chronos-2 ◄───────┘                         │
      (Hugging Face)                              │
            │                                     │
            └───────────► Demand Predictions ────►│ (Heuristic Capacity Ranking)
                                                  │
                                                  ▼
                                            Recommended Slot
```

### Layer Roles
- **React Frontend:** Handles farmer and staff UI interactions, captures user selections (crop, center, date, quantity), and displays formatted recommendations and estimates.
- **FastAPI Backend:** Serves as the central API gateway, validating incoming request schemas, handling CORS, and orchestrating downstream business services.
- **ML API Layer (`backend/app/api/ml.py`):** Translates REST inputs into tensor structures, manages model lifecycle, invokes inference modules, and sanitizes output payloads.
- **ML Modules (`ml/`):** Pure Python domain packages encapsulating time-series preprocessing, zero-shot inference, and slot ranking algorithms.
- **Pretrained Foundation Model (`amazon/chronos-2`):** Pretrained transformer model delivering zero-shot probabilistic time-series forecasting.

---

## 3. Hugging Face Model: `amazon/chronos-2`

### Model Overview
- **Official Model Identifier:** `amazon/chronos-2`
- **Architecture:** Pretrained encoder-decoder time-series transformer based on the T5 architecture.
- **Parameters:** ~120M parameters (`d_model: 768`, `12 layers`, `12 attention heads`).
- **Quantile Predictions:** 21 output quantiles (`0.01` to `0.99`), where index 10 represents the `0.50` median forecast.

### Critical Clarification on Training Domain
> **Important:** `amazon/chronos-2` is a **general-purpose, cross-domain time-series foundation model**. It was **NOT** trained specifically on Indian agriculture, Karnataka APMC data, or Esy FARM records. It treats numerical inputs as abstract temporal sequences and forecasts statistical continuations based on pretrained zero-shot capabilities. It is **not** trained from scratch by this project.

### Why Chronos-2 Was Selected
1. **Zero-Shot Generalization:** Delivers reliable univariate forecasting out-of-the-box without requiring millions of local training epochs.
2. **CPU Feasibility:** Operates efficiently on standard CPU hardware (`device_map="cpu"`, `torch.float32`), avoiding mandatory GPU dependencies in hackathon and edge deployments.
3. **Probabilistic Quantiles:** Emits full probability distributions, enabling reliable median extraction alongside confidence bounds.

### How Inference Works
The pipeline tokenizes chronological numerical values into time-series patches, processes them through the transformer backbone, and decodes future values across specified forecasting horizons (`prediction_length`).

---

## 4. Crop Price Estimator (`ml/price_estimator/`)

### Purpose
Forecasts short-term price trajectories for agricultural commodities based on chronological price points, providing farmers with an estimated procurement value for their produce.

### Official MSP vs. ML Forecast
- **Official MSP (Minimum Support Price):** A fixed government policy benchmark (INR per quintal) determined by the Commission for Agricultural Costs and Prices (CACP). It is invariant and **never** predicted, altered, or fabricated by the model.
- **ML Price Forecast:** A statistical time-series projection reflecting market trend behavior.
- **Separation Guarantee:** The API strictly maintains MSP and ML forecasts in distinct fields. The system never presents an ML prediction as an official government rate.

### Pipeline Implementation
1. **Input:** `crop`, `district`, `season`, `quantity_quintals`, `msp`, optional `historical_prices`, and `date`.
2. **Preprocessing:** Historical numerical sequence is converted into a 3D PyTorch tensor of shape `(n_series=1, n_variates=1, history_length)`. When historical prices are omitted by the caller, a 5-point realistic baseline preceding the target date is constructed.
3. **Inference:** `Chronos2Pipeline.predict(context_tensor, prediction_length=1)` executes on CPU.
4. **Quantile Extraction:** Extracts the 50th percentile (median) at quantile index 10 (`arr[0, 10, :]`).
5. **Output Calculation:** `estimated_value = round(predicted_unit_price * quantity_quintals, 2)`.

### Actual API Output Example
```json
{
  "crop": "Ragi",
  "quantity_quintals": 25.0,
  "msp": 4863.0,
  "estimated_price_per_quintal": 4909.14,
  "estimated_value": 122728.5,
  "model_used": "amazon/chronos-2",
  "disclaimer": "Estimated value is a statistical forecast generated by amazon/chronos-2 foundation model based on time-series patterns and is not an official government guaranteed price. Official MSP is provided separately as an administrative reference benchmark."
}
```

---

## 5. Procurement Slot Demand Predictor (`ml/demand_predictor/`)

### Purpose
Forecasts expected farmer booking traffic for upcoming operating windows at a procurement centre to prevent physical crowding and logistics bottlenecks.

### Inputs Supported
- `centre` / `procurement_centre`: Centre name or ID.
- `crop`: Commodity to be procured.
- `date`: Target procurement date (`YYYY-MM-DD`).
- `slots`: List of operating slot windows (e.g. `["09:00-10:00", "10:00-11:00", "11:00-12:00"]`).
- `historical_booking_data`: Optional dictionary mapping `{slot: [past_booking_counts]}`.
- `centre_capacity`: Slot capacity limit (default: 60).

### Time-Series Ingestion & Forecasting
Each slot's past traffic sequence is formatted into a 3D tensor `(1, 1, seq_len)` and passed to Chronos-2. The model forecasts 1 step ahead (`prediction_length=1`), and the median quantile is extracted and rounded to a non-negative integer.

### Actual API Output Example
```json
{
  "centre": "Example Centre",
  "crop": "Ragi",
  "date": "2026-10-15",
  "slots": [
    { "slot": "09:00-10:00", "predicted_demand": 35 },
    { "slot": "10:00-11:00", "predicted_demand": 24 },
    { "slot": "11:00-12:00", "predicted_demand": 24 }
  ],
  "model_used": "amazon/chronos-2"
}
```

---

## 6. Smart Slot Recommender (`ml/slot_recommender/`)

### Design Principles
- **No Heavy Model Overhead:** Does **not** load another large language or vision model.
- **Heuristic Ranking Engine:** Combines the demand forecasts produced by Chronos-2 with real-time center throughput capacity and live confirmed bookings.

### Ranking Methodology
For each selectable slot:
1. **Current Booked Count:** `existing_bookings.get(slot, 0)`
2. **Predicted Incoming Demand:** `predicted_demand.get(slot, 0)` (from Chronos-2)
3. **Total Projected Load:** `current_booked + predicted_demand`
4. **Congestion Ratio:** `total_projected_load / centre_capacity`
5. **Remaining Physical Capacity:** `max(0, centre_capacity - current_booked)`

Slots are sorted prioritizing:
1. Non-full slots first (`current_booked < centre_capacity`).
2. Lowest congestion ratio (least crowded).
3. Highest remaining physical capacity.

### Reason Formulation
The top-ranked slot is returned with a transparent explanation such as `"Lower expected congestion"`.
> **Disclaimer:** The recommendation assists queue distribution; it does not guarantee instant gate clearance or bypass mandatory quality grading.

### Actual API Output Example
```json
{
  "recommended_slot": "10:00-11:00",
  "predicted_demand": 20,
  "reason": "Lower expected congestion"
}
```

---

## 7. FastAPI ML API

### Base Route
`http://localhost:8000/api/ml`

### Request Routing Architecture
React never communicates directly with Hugging Face. The complete round-trip flow is:
$$\text{React UI} \longrightarrow \text{FastAPI Gateway} \longrightarrow \text{ML Router} \longrightarrow \text{ML Module} \longrightarrow \text{Chronos-2 Pipeline} \longrightarrow \text{FastAPI Response} \longrightarrow \text{React UI}$$

### Endpoints Specification

#### 1. `POST /api/ml/price-estimate`
- **Module Called:** `ml.price_estimator.predict_crop_price`
- **Input Schema:** `crop` (str), `district` (str), `season` (str), `quantity_quintals` (float), `msp` (float), optional `historical_prices` (list[float]).
- **Validation:** Pydantic `PriceEstimateRequest` enforces positive quantities and positive MSP.

#### 2. `POST /api/ml/demand-predict`
- **Module Called:** `ml.demand_predictor.predict_slot_demand`
- **Input Schema:** `centre` (str), `crop` (str), `date` (str), `slots` (list[str]), optional `historical_booking_data` (dict), optional `centre_capacity` (int).
- **Validation:** Pydantic `SlotDemandRequest` ensures at least 1 slot window is specified.

#### 3. `POST /api/ml/recommend-slot`
- **Module Called:** `ml.slot_recommender.recommend_procurement_slot`
- **Input Schema:** `slots` or `available_slots` (list[str]), optional `predicted_demand` (dict), optional `existing_bookings` (dict), `centre_capacity` (int).
- **Feature:** If `predicted_demand` is not pre-computed by client, the endpoint automatically invokes Chronos-2 to forecast demand for each candidate slot before ranking.

#### 4. `GET /health`
- **Purpose:** Verifies server health, service version, and active model names without leaking environment tokens.

---

## 8. Environment Configuration

### Backend Environment File: `backend/.env`
Configuration is managed via `python-dotenv` and loaded centrally in `backend/app/config.py`.

```env
# Hugging Face Token (optional for public models like amazon/chronos-2)
HF_TOKEN=

# Model identifiers from Hugging Face
PRICE_MODEL=amazon/chronos-2
DEMAND_MODEL=amazon/chronos-2

# API Server Host and Port
ML_API_HOST=0.0.0.0
ML_API_PORT=8000
```

### Security & Token Handling Rules
- **Optional Token:** `amazon/chronos-2` is a public repository; `HF_TOKEN` is optional and only utilized to increase download rate limits when provided.
- **No Hardcoded Tokens:** Tokens are never stored in source code or committed to Git.
- **Git Protection:** `.gitignore` explicitly excludes `.env`, `backend/.env`, and all `.env.*` files.
- **Zero Frontend Leakage:** `HF_TOKEN` is never exposed via any API response or sent to client-side bundles.

---

## 9. Project File Structure

```
d:/Esy farm/
├── backend/
│   ├── .env                      # Backend environment variables (git-ignored)
│   ├── requirements.txt          # Backend dependencies (fastapi, uvicorn, pydantic, etc.)
│   ├── test_api.py               # End-to-end FastAPI endpoint test suite
│   └── app/
│       ├── __init__.py           # Application package init
│       ├── config.py             # Environment configuration reader
│       ├── main.py               # FastAPI entrypoint, CORS middleware, and /health route
│       └── api/
│           ├── __init__.py       # API package init
│           └── ml.py             # Dedicated ML router (/api/ml/*)
│
├── ml/
│   ├── __init__.py               # ML root package
│   ├── test_ml_modules.py        # Standalone ML module test suite
│   ├── ML_DOCUMENTATION.md       # Technical ML documentation (this file)
│   │
│   ├── price_estimator/
│   │   ├── __init__.py
│   │   ├── model.py              # Chronos-2 loader and pipeline singleton cache
│   │   ├── train.py              # Dataset standardization hooks for future APMC data
│   │   ├── predict.py            # 3D tensor preparation and price forecasting logic
│   │   └── requirements.txt
│   │
│   ├── demand_predictor/
│   │   ├── __init__.py
│   │   ├── model.py              # Chronos-2 loader for demand forecasting
│   │   ├── train.py              # Booking log transformation hooks
│   │   ├── predict.py            # Slot traffic forecast engine
│   │   └── requirements.txt
│   │
│   └── slot_recommender/
│       ├── __init__.py
│       ├── recommender.py        # Congestion scoring and slot ranking algorithm
│       └── requirements.txt
│
└── src/                          # React frontend (untouched by ML layer)
```

---

## 10. Complete Data Flow

```
Farmer / Staff selects crop, centre, and slot parameters in React UI
                           │
                           ▼
React UI issues HTTP POST to FastAPI backend (/api/ml/...)
                           │
                           ▼
FastAPI validates request types and ranges using Pydantic schemas
                           │
                           ▼
ML Router routes request to appropriate sub-package in ml/
                           │
                           ▼
Pre-processor formats time-series values into 3D float32 tensor (1, 1, seq_len)
                           │
                           ▼
Pretrained Chronos-2 pipeline executes zero-shot autoregressive inference on CPU
                           │
                           ▼
Quantile extractor isolates median prediction (quantile index 10)
                           │
                           ▼
Slot recommender evaluates predicted demand against centre capacity
                           │
                           ▼
FastAPI returns structured JSON response with official MSP kept separate
                           │
                           ▼
React UI displays formatted estimates and congestion-ranked slots
```

---

## 11. Pretrained Model vs. Custom Logic

| Component | Nature | Description |
| :--- | :--- | :--- |
| **`amazon/chronos-2`** | Pretrained Foundation Model | Pretrained time-series transformer developed by Amazon; performs autoregressive tokenized numerical forecasting. |
| **Input Preprocessing** | Custom Project Logic | Validates raw inputs, constructs 3D tensors `(n_series, n_variates, history_length)`, and handles missing sequences. |
| **Price Estimation Pipeline** | Custom Project Logic | Pairs Chronos-2 price projections with official MSP benchmarks and calculates total estimated value based on quintals. |
| **Slot Demand Engine** | Custom Project Logic | Translates slot operating windows into time-series sequences and bounds predicted traffic to positive integers. |
| **Slot Recommender Algorithm** | Custom Project Logic | Computes capacity congestion ratios, filters full slots, and generates human-readable booking reasons. |
| **FastAPI Layer** | Custom Project Logic | Exposes REST endpoints, handles validation, manages environment secrets, and implements CORS. |

### Why This Hybrid Architecture is Useful
Using a foundation model eliminates the need to collect millions of proprietary training records or manage costly local training clusters. Surrounding the foundation model with custom business logic ensures that agricultural domain constraints (such as invariant MSP rates and center physical limits) are strictly upheld.

---

## 12. Model Training & Data Honesty

- **No Scratch Training:** This project does **not** train a neural network from scratch.
- **Zero-Shot Foundation Model:** Chronos-2 is utilized strictly in inference mode.
- **Test Data Disclaimer:** Sequences used during automated tests (`test_ml_modules.py`, `test_api.py`) are synthetic **TEST DATA** created solely to verify code execution. They are **not** official government-issued historical datasets.
- **No Fabricated Accuracies:** We make no claims of "99% prediction accuracy." Predictive accuracy in real deployment is subject to empirical validation against real mandi datasets.
- **Future Fine-Tuning Capability:** `train.py` modules provide data preparation hooks to ingest real AGMARKNET or Karnataka Food & Civil Supplies logs if supervised fine-tuning or LoRA adaptation is undertaken in future phases.

---

## 13. Testing Results

All tests described below were executed locally and confirmed passing with **0 errors**:

| Test Phase | Target | Test Result | Details |
| :--- | :--- | :--- | :--- |
| **1. Model Loading** | `ml.price_estimator.load_price_model` | **PASSED** | `amazon/chronos-2` weights loaded onto CPU via `Chronos2Pipeline`. |
| **2. Standalone Price Forecast** | `ml.test_ml_modules.test_2_price_forecasting` | **PASSED** | Inputs: Ragi, Mandya, test series `[2150..2290]`. Output: `[2314.07, 2319.42, 2330.03]`. MSP: INR 2250.0. |
| **3. Standalone Demand Forecast** | `ml.test_ml_modules.test_3_demand_prediction` | **PASSED** | Inputs: Paddy, test counts `[35, 42, 38, 45, 44, 49, 47]`. Output: `47` bookings for `10:00-11:00` (78.3% utilization). |
| **4. Standalone Slot Recommender**| `ml.test_ml_modules.test_4_slot_recommender` | **PASSED** | Ranked 4 slots; selected `14:00-15:00` (lowest congestion 53.3%, 50 seats remaining). |
| **5. FastAPI GET /health** | `backend/test_api.py` | **PASSED** | HTTP 200: Confirmed service health and model names without token leaks. |
| **6. FastAPI POST /price-estimate** | `backend/test_api.py` | **PASSED** | HTTP 200: Estimated price `4909.14`, total value `122728.5`, MSP `4863.0` intact. |
| **7. FastAPI POST /demand-predict** | `backend/test_api.py` | **PASSED** | HTTP 200: Returned predicted demand for 3 slots (`35`, `24`, `24`). |
| **8. FastAPI POST /recommend-slot** | `backend/test_api.py` | **PASSED** | HTTP 200: Recommended `10:00-11:00` (`predicted_demand: 20`, reason: `"Lower expected congestion"`). |
| **9. Frontend Build Integrity** | `npm run build` (`tsc -b && vite build`) | **PASSED** | Built in 1.19s with 0 errors; verified frontend is completely undisturbed. |

---

## 14. Limitations

1. **Dependency on Input Quality:** Forecast quality is strictly bounded by the accuracy, length, and frequency of historical time-series data passed in.
2. **General-Purpose Model:** Chronos-2 does not possess innate knowledge of monsoon patterns, local harvest holidays, or sudden APMC strike actions; its predictions are purely mathematical trend projections.
3. **Synthetic Test Contexts:** In the absence of live backend database connections, default test runs rely on synthetic test series.
4. **Estimates vs. Guarantees:** Predictions represent statistical probabilities and cannot guarantee physical center wait times or market price realization.

---

## 15. Future Improvements

- **AGMARKNET Integration:** Ingest real historical daily modal price data from Karnataka APMC mandis via open government APIs.
- **Center-Specific Booking Logs:** Link demand predictor to Supabase booking tables to dynamically pass real past 30-day slot traffic curves.
- **Weather & Rainfall Features:** Incorporate meteorological rainfall indices as exogenous covariates when supported.
- **Parameter-Efficient Fine-Tuning (PEFT/LoRA):** Fine-tune the Chronos-2 backbone on historical Karnataka agricultural procurement data.
- **Continuous Monitoring:** Implement telemetry to measure Mean Absolute Scaled Error (MASE) between predicted slot demand and actual farmer arrivals.

---

## 16. How to Explain the AI System to Judges (Hackathon Guide)

When presenting Esy FARM to evaluators or jury members, use this concise 6-point explanation:

1. **Foundation Model Approach:** *"We integrated Amazon Chronos-2, an open-weights time-series foundation model from Hugging Face, running locally on CPU for zero-shot forecasting."*
2. **Dual Forecasting Role:** *"We use Chronos-2 in two key areas: projecting commodity price trajectories relative to official MSP benchmarks, and forecasting farmer booking volume across procurement slots."*
3. **Decoupled Architecture:** *"The ML engine is cleanly isolated inside an independent Python module and exposed through a validated FastAPI gateway, ensuring zero overhead on our React frontend."*
4. **Smart Slot Optimization:** *"Our slot recommender combines Chronos-2 demand forecasts with real-time center throughput capacity to automatically steer farmers toward lower-congestion windows."*
5. **Separation of Official Data:** *"We maintain strict integrity: the official government MSP is kept separate as an administrative benchmark and is never altered or claimed to be an ML prediction."*
6. **Production-Ready Extensibility:** *"The pipeline uses standardized time-series schemas, making it immediately ready to ingest live APMC market data and real procurement audit logs without changing the core codebase."*

---

## 17. Important Claims to Avoid

To maintain absolute technical integrity, team members must **NEVER** state:
- ❌ *"Chronos-2 is an agricultural model trained specifically on Karnataka farmers."* (It is a general-purpose pretrained foundation model).
- ❌ *"The system predicts the official government MSP."* (MSP is determined administratively by the government, not predicted by AI).
- ❌ *"The model guarantees 99% accuracy."* (Accuracy depends on real historical data and has not been subjected to longitudinal production benchmarking).
- ❌ *"The model guarantees that farmers will not wait in line."* (It recommends lower-congestion slots to reduce queuing, but physical grading and unloading bottlenecks can still occur).
- ❌ *"We trained this AI model from scratch."* (We perform zero-shot inference using Amazon's pretrained foundation weights).
- ❌ *"We are pulling real-time live government procurement data right now."* (The API is architected to ingest live data, but currently utilizes test series for demonstration).
