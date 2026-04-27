import firebase_admin
from firebase_admin import credentials, firestore, storage
import os

# Ensure the service account key is securely loaded
cred_path = os.getenv("FIREBASE_CREDENTIALS", "serviceAccountKey.json")

try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'urbanclean-ai.appspot.com' # Replace with actual bucket
        })
    db = firestore.client()
    print("✅ Firebase Initialized Successfully")
except Exception as e:
    print(f"⚠️ Firebase Initialization Failed: {e}. Ensure serviceAccountKey.json is present.")
    db = None
