MODEL_VERSION = "1.0.0"
model = "MockModel"

def predict_output(data: dict):
    # Mock prediction logic
    score = 750 if data.get('debt_amount', 0) < 10000 else 620
    return {
        "gig_credit_score": score,
        "approval_probability": 0.85,
        "max_loan_amount": 50000
    }
