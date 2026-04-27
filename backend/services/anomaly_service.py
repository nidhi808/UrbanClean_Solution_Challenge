def check_for_anomalies(current_data: dict, historical_average: dict) -> list:
    """
    Detect anomalies such as leakages or abnormal spikes in resource consumption.
    """
    anomalies = []
    
    current_water = current_data.get("water", 0)
    avg_water = historical_average.get("water", 1)
    
    current_elec = current_data.get("electricity", 0)
    avg_elec = historical_average.get("electricity", 1)
    
    # 50% spike in water could indicate a leakage
    if current_water > avg_water * 1.5:
        anomalies.append({
            "type": "leakage",
            "severity": "HIGH",
            "message": f"Abnormal water usage detected: {current_water} vs avg {avg_water}"
        })
        
    # 40% spike in electricity
    if current_elec > avg_elec * 1.4:
        anomalies.append({
            "type": "abnormal_spike",
            "severity": "MEDIUM",
            "message": f"Abnormal electricity spike detected: {current_elec} vs avg {avg_elec}"
        })
        
    return anomalies
