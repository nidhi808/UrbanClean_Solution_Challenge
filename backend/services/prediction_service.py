import random

def predict_demand(time_series_data: list) -> dict:
    """
    Predict future water/electricity demand based on historical time-series data.
    Uses a mock predictive model for scaffolding purposes.
    """
    # In a production environment, this would use scikit-learn, ARIMA, or an LSTM model.
    if not time_series_data:
        return {"predicted_water": 0, "predicted_electricity": 0}
        
    last_water = time_series_data[-1].get("water", 100)
    last_elec = time_series_data[-1].get("electricity", 500)
    
    # Simulate a prediction (random fluctuation)
    predicted_water = last_water * random.uniform(0.9, 1.2)
    predicted_elec = last_elec * random.uniform(0.9, 1.2)
    
    return {
        "predicted_water": round(predicted_water, 2),
        "predicted_electricity": round(predicted_elec, 2)
    }
