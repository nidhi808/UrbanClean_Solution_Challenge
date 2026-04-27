from firebase_admin import storage
import uuid

def upload_image(file_bytes, filename: str) -> str:
    """Uploads an image to Firebase Storage and returns the public URL."""
    try:
        bucket = storage.bucket()
        unique_filename = f"issues/{uuid.uuid4()}_{filename}"
        blob = bucket.blob(unique_filename)
        
        blob.upload_from_string(file_bytes, content_type="image/jpeg")
        blob.make_public()
        
        return blob.public_url
    except Exception as e:
        print(f"Failed to upload image: {e}")
        return None
