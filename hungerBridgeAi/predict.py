
import json
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

MODEL_DIR = "./models/hungerbridge"
THRESHOLD = 0.5

# Load trained multi-label model
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

model.eval()

# Use the same category vocabulary used during training
with open(f"{MODEL_DIR}/label_names.json", encoding="utf-8") as f:
    categories = json.load(f)

def predict_food(food, threshold=THRESHOLD):
    inputs = tokenizer(
        food,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128,
    )

    with torch.no_grad():
        outputs = model(**inputs)

    # Independent probability for each category
    probabilities = torch.sigmoid(outputs.logits)[0]

    predictions = [
        {
            "category": categories[i],
            "confidence": probabilities[i].item(),
        }
        for i in range(len(categories))
        if probabilities[i].item() >= threshold
    ]

    predictions.sort(key=lambda item: item["confidence"], reverse=True)

    return predictions


foods = [
    "Food: fresh milk | Ingredients: cow milk",
    "Food: plain curd | Ingredients: curd",
    "Food: cheese | Ingredients: milk",

    "Food: Plain paneer | Ingredients: paneer",
    "Food: paneer masala | Ingredients: paneer, tomato, spices",
    "Food: paneer butter masala | Ingredients: paneer, tomato, cream, butter, spices",
    "Food: palak paneer | Ingredients: spinach, paneer, spices",
    "Food: matar paneer | Ingredients: peas, paneer, tomato, spices",

    "Food: raw carrot | Ingredients: carrot",
    "Food: raw potato | Ingredients: potato",
    "Food: raw chicken | Ingredients: chicken",

    "Food: chicken biryani | Ingredients: chicken, rice, spices, curd",
]

for food in foods:
    predictions = predict_food(food)

    print(f"\nFood: {food}")
    if predictions:
        for item in predictions:
            print(
                f"  {item['category']}: "
                f"{item['confidence']:.2%}"
            )
    else:
        print("  No categories passed the threshold.")
