
import json
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

# Load dataset
df = pd.read_csv("data/food_dataset_cooked_2000.csv")

# Validate required columns
required_columns = {"food_name", "ingredients", "categories"}
missing = required_columns - set(df.columns)

if missing:
    raise ValueError(f"Missing dataset columns: {missing}")

# Remove rows without usable food names or categories
df = df.dropna(subset=["food_name", "categories"]).copy()

# Create model input from food name + ingredients
df["text"] = (
    "Food: " + df["food_name"].astype(str)
    + " | Ingredients: " + df["ingredients"].fillna("").astype(str)
)

# Convert comma-separated category combinations into independent labels
def parse_categories(value):
    return sorted({
        category.strip()
        for category in str(value).split(",")
        if category.strip()
    })

df["labels"] = df["categories"].apply(parse_categories)

# Remove rows without labels
df = df[df["labels"].map(len) > 0].copy()

# Get all individual labels, not complete combinations
label_names = sorted({
    label
    for labels in df["labels"]
    for label in labels
})

print("Individual categories:")
for label in label_names:
    count = sum(label in labels for labels in df["labels"])
    print(f"{label}: {count} examples")

print("\nTotal food examples:", len(df))
print("Total individual labels:", len(label_names))

# Random split: do not stratify on complete category combinations
train_df, test_df = train_test_split(
    df,
    test_size=0.2,
    random_state=42,
    shuffle=True,
)

# Store labels as JSON arrays for the training script
train_df = train_df.copy()
test_df = test_df.copy()

train_df["labels"] = train_df["labels"].apply(
    lambda labels: json.dumps(labels)
)
test_df["labels"] = test_df["labels"].apply(
    lambda labels: json.dumps(labels)
)

# Save output files
Path("data").mkdir(exist_ok=True)

train_df[["text", "labels"]].to_csv(
    "data/train.csv", index=False
)
test_df[["text", "labels"]].to_csv(
    "data/test.csv", index=False
)

# Save the fixed label vocabulary for training and inference
with open("data/label_names.json", "w", encoding="utf-8") as f:
    json.dump(label_names, f, indent=2)

print("\nDataset prepared successfully!")
print("Training examples:", len(train_df))
print("Testing examples:", len(test_df))
print("Label vocabulary saved to data/label_names.json")
