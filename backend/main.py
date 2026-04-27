from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import detect, analyze, resource
import firebase.config # Initializes Firebase

app = FastAPI(title="UrbanClean AI Backend", description="AI-Powered Smart Resource Allocation Platform")

# CORS Configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(detect.router, prefix="/detect", tags=["Detection"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])
app.include_router(resource.router, prefix="/resource", tags=["Resources"])

@app.get("/")
async def root():
    return {"message": "Welcome to the UrbanClean AI Backend", "status": "online"}
