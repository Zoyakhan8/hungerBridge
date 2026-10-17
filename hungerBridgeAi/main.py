
import json
from pathlib import Path

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Project paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models" / "hungerbridge"

# Find the label file in either common location
LABEL_PATHS = [
    MODEL_DIR / "label_names.json",
    BASE_DIR / "data" / "label_names.json",
    BASE_DIR / "label_names.json",
]

label_path = next((p for p in LABEL_PATHS if p.exists()), None)

if not MODEL_DIR.exists():
    raise FileNotFoundError(f"Model directory not found: {MODEL_DIR}")

if label_path is None:
    raise FileNotFoundError(
        "label_names.json not found. Check where train.py saved it."
    )

with open(label_path, "r", encoding="utf-8") as file:
    labels = json.load(file)

# Support either a list of labels or an index-to-label dictionary
if isinstance(labels, dict):
    labels = [
        labels[key]
        for key in sorted(labels, key=lambda k: int(k))
    ]

if not isinstance(labels, list) or not all(
    isinstance(label, str) for label in labels
):
    raise ValueError("label_names.json must contain a list of label names.")

# Load the saved model once when the API starts
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(
    str(MODEL_DIR),
    local_files_only=True,
)

model = AutoModelForSequenceClassification.from_pretrained(
    str(MODEL_DIR),
    local_files_only=True,
)

if model.config.num_labels != len(labels):
    raise ValueError(
        f"Model has {model.config.num_labels} outputs, "
        f"but label_names.json has {len(labels)} labels."
    )

model.to(device)
model.eval()

app = FastAPI(title="HungerBridge Food Classification API")


class FoodInput(BaseModel):
    food_name: str = Field(min_length=1, max_length=200)
    ingredients: list[str] = Field(min_length=1, max_length=100)


@app.get("/")
def home():
    return {
        "message": "HungerBridge AI is running",
        "labels_count": len(labels),
    }


@app.get("/health")
def health():
    return {
        "status": "ready",
        "model_loaded": True,
        "labels_count": len(labels),
    }


@app.post("/predict")
def predict_food(food: FoodInput):
    food_name = food.food_name.strip()
    ingredients = [item.strip() for item in food.ingredients if item.strip()]

    if not food_name:
        raise HTTPException(status_code=422, detail="Food name is required.")

    if not ingredients:
        raise HTTPException(
            status_code=422,
            detail="At least one non-empty ingredient is required.",
        )

    # Match the text format used when training the model
    text = (
        f"Food: {food_name} | Ingredients: {', '.join(ingredients)}"
    )

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=128,
    )

    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.inference_mode():
        outputs = model(**inputs)
        probabilities = torch.sigmoid(outputs.logits)[0].cpu().tolist()

    THRESHOLD = 0.5

    predictions = [
        {
            "category": label,
            "confidence": round(float(score), 4),
        }
        for label, score in zip(labels, probabilities)
        if float(score) >= THRESHOLD
    ]

    predictions.sort(
        key=lambda item: item["confidence"],
        reverse=True,
    )

    return {
        "food_name": food_name,
        "predictions": predictions,
        "threshold": THRESHOLD,
    }

