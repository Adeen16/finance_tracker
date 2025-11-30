from fastapi import FastAPI
from fastapi.responses import JSONResponse
try:
    from backend.scchema.user_input import UserInput
    from backend.pre import predict_output, model, MODEL_VERSION
except ImportError:
    from scchema.user_input import UserInput
    from pre import predict_output, model, MODEL_VERSION
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Gig Worker Prediction API Running Successfully"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_version": MODEL_VERSION,
        "model_loaded": model is not None
    }

@app.post("/predict")
def predict(data: UserInput):
    # 1️⃣ Convert Pydantic model → dict
    user_input = data.dict()

    # 2️⃣ Get prediction dict from model
    result = predict_output(user_input)

    # 3️⃣ Return all metrics
    return JSONResponse(
        status_code=200,
        content={
            "predictions": result,
            "message": "Prediction successful"
        }
    )
