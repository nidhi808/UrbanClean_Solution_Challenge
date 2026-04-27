from fastapi import APIRouter, File, UploadFile, HTTPException
from services.yolo_service import detect_objects
from firebase.storage_service import upload_image
import traceback

router = APIRouter()

@router.post("/issues")
async def detect_issues(file: UploadFile = File(...)):
    """
    Detect multiple urban issues from an uploaded image/video frame.
    1. Reads image bytes
    2. Runs YOLOv8 detection
    3. (Optional) Uploads image to Firebase Storage
    """
    try:
        contents = await file.read()
        
        # 1. Run YOLO detection
        detections = detect_objects(contents)
        
        # 2. Upload to Firebase Storage for record keeping
        # image_url = upload_image(contents, file.filename)
        image_url = f"mock_url_for_{file.filename}"
        
        # 3. Compile response
        response = {
            "image_url": image_url,
            "detections": detections,
            "summary": {
                "total_issues_found": len(detections),
                "types_detected": list(set([d['type'] for d in detections]))
            }
        }
        
        return response
        
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
