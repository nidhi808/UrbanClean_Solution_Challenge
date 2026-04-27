from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.prioritization_service import calculate_priority, get_severity_score
from firebase.firestore_service import save_issue, create_alert

router = APIRouter()

class DetectionInput(BaseModel):
    type: str
    confidence: float
    bbox: list

class AnalyzeRequest(BaseModel):
    detections: List[DetectionInput]
    location: dict
    resource_data: Optional[dict] = None

@router.post("/issue")
async def analyze_issue(request: AnalyzeRequest):
    """
    Analyze detection output, calculate severity and priority, and save to Firestore.
    """
    try:
        results = []
        for det in request.detections:
            # Approximate object size from bbox [x1, y1, x2, y2]
            width = det.bbox[2] - det.bbox[0]
            height = det.bbox[3] - det.bbox[1]
            object_size = (width * height) / (1920 * 1080) # Normalize to 1080p frame
            
            # Use Prioritization logic
            severity = get_severity_score(det.type, det.confidence)
            priority = calculate_priority(det.confidence, object_size)
            
            # Determine recommended action
            action = f"Dispatch maintenance team for {det.type}" if priority == "HIGH" else f"Monitor {det.type}"
            
            # Prepare Issue payload for Firebase
            issue_payload = {
                "type": det.type,
                "location": request.location,
                "severity": severity,
                "priority": priority,
                "status": "pending",
                "recommended_action": action,
                "resource_data": request.resource_data
            }
            
            # Save to Firestore
            saved_issue = save_issue(issue_payload)
            
            # If HIGH priority, trigger an alert in Firestore (which could trigger FCM via Cloud Functions)
            if priority == "HIGH":
                create_alert(saved_issue.get('id', 'temp_id'), f"Critical {det.type} detected at location", "HIGH")
                
            results.append(saved_issue)
            
        return {"analyzed_issues": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
