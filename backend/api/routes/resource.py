from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from services.prediction_service import predict_demand
from services.anomaly_service import check_for_anomalies

router = APIRouter()

class TimeSeriesRequest(BaseModel):
    historical_data: List[Dict]

class AnomalyRequest(BaseModel):
    current_data: dict
    historical_average: dict

@router.post("/predict")
async def predict_resources(request: TimeSeriesRequest):
    """
    Predict future resource demand based on time-series data.
    """
    try:
        predictions = predict_demand(request.historical_data)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/anomaly")
async def detect_anomaly(request: AnomalyRequest):
    """
    Detect abnormal spikes or leakages in resource consumption.
    """
    try:
        anomalies = check_for_anomalies(request.current_data, request.historical_average)
        
        # If anomalies found, could save an alert to Firebase here
        
        return {"anomalies": anomalies, "status": "critical" if anomalies else "normal"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
