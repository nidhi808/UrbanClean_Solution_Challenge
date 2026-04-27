def calculate_priority(confidence: float, object_size: float, location_importance: float = 1.0, historical_weight: float = 1.0) -> str:
    """
    Combine detection confidence, object size, location importance, and historical data to determine priority.
    """
    # Simple scoring mechanism for demonstration
    base_score = (confidence * 0.4) + (object_size * 0.4) + (location_importance * 0.2)
    adjusted_score = base_score * historical_weight
    
    if adjusted_score > 0.75:
        return "HIGH"
    elif adjusted_score > 0.4:
        return "MEDIUM"
    else:
        return "LOW"

def get_severity_score(issue_type: str, confidence: float) -> float:
    """
    Calculate a severity score based on the issue type and model confidence.
    """
    severity_weights = {
        "leakage": 0.9,
        "pothole": 0.8,
        "road_damage": 0.7,
        "garbage": 0.4
    }
    
    weight = severity_weights.get(issue_type, 0.5)
    return min(1.0, weight * confidence)
