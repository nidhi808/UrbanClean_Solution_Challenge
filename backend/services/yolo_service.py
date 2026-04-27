import os

# Placeholder for ultralytics YOLO model
try:
    from ultralytics import YOLO
    model_path = os.path.join(os.path.dirname(__file__), '../models/yolo_model.pt')
    if os.path.exists(model_path):
        model = YOLO(model_path)
    else:
        model = None
except ImportError:
    model = None

# Custom classes matching the prompt requirement
CLASSES = ["pothole", "garbage", "leakage", "road_damage"]

def detect_objects(image_bytes):
    """
    Run YOLOv8 object detection on the image.
    Returns a list of detected objects (type, bbox, confidence).
    """
    if not model:
        # Return mock data if model is not loaded (useful for testing without GPU/model file)
        print("⚠️ YOLO model not loaded. Returning mock detections.")
        return [
            {"type": "pothole", "bbox": [100, 150, 200, 250], "confidence": 0.88},
            {"type": "road_damage", "bbox": [300, 400, 350, 450], "confidence": 0.76}
        ]
    
    # In a real scenario, convert image_bytes to cv2 image and run prediction
    import cv2
    import numpy as np
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    results = model(img)
    detections = []
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            class_id = int(box.cls[0])
            conf = float(box.conf[0])
            
            # Map to our custom classes if necessary, assuming the model is trained on them
            class_name = CLASSES[class_id] if class_id < len(CLASSES) else "unknown"
            
            detections.append({
                "type": class_name,
                "bbox": box.xyxy[0].tolist(),
                "confidence": round(conf, 3)
            })
            
    return detections
