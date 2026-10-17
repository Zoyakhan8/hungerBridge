
import json
from pathlib import Path

import numpy as np
import pandas as pd
import torch

from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)
from sklearn.metrics import (
    f1_score,
    precision_score,
    recall_score,
)

MODEL_NAME = "distilbert-base-uncased"
DATA_DIR = Path("data")
MODEL_DIR = Path("models/hungerbridge")

# -------------------------
# 1. Load datasets and labels
# -------------------------

train_df = pd.read_csv(DATA_DIR / "train.csv")
test_df = pd.read_csv(DATA_DIR / "test.csv")

with open(DATA_DIR / "label_names.json", encoding="utf-8") as f:
    categories = json.load(f)

if not categories:
    raise ValueError("No categories found in label_names.json")

label2id = {label: i for i, label in enumerate(categories)}
id2label = {i: label for label, i in label2id.items()}

print("Individual categories:")
for i, category in enumerate(categories):
    print(i, "=", category)

# -------------------------
# 2. Convert label lists into multi-hot vectors
# -------------------------

def encode_labels(value):
    labels = json.loads(value) if isinstance(value, str) else value

    unknown = set(labels) - set(label2id)
    if unknown:
        raise ValueError(f"Unknown categories: {unknown}")

    vector = [0.0] * len(categories)

    for label in labels:
        vector[label2id[label]] = 1.0

    return vector


for df in (train_df, test_df):
    if "text" not in df.columns or "labels" not in df.columns:
        raise ValueError(
            "Expected text and labels columns. "
            "Run prepare_data.py first."
        )

    df["labels"] = df["labels"].apply(encode_labels)

# Warn about labels with no positive training examples
train_counts = np.sum(
    np.array(train_df["labels"].tolist()), axis=0
)

missing_training_labels = [
    categories[i]
    for i, count in enumerate(train_counts)
    if count == 0
]

if missing_training_labels:
    print(
        "\nWARNING: These labels have no training examples:",
        missing_training_labels,
    )
    print("Their predictions will not be reliable.")

print("\nTraining rows:", len(train_df))
print("Testing rows:", len(test_df))
print("Number of labels:", len(categories))

# -------------------------
# 3. Create Hugging Face datasets
# -------------------------

train_dataset = Dataset.from_dict({
    "text": train_df["text"].astype(str).tolist(),
    "labels": train_df["labels"].tolist(),
})

test_dataset = Dataset.from_dict({
    "text": test_df["text"].astype(str).tolist(),
    "labels": test_df["labels"].tolist(),
})

# -------------------------
# 4. Tokenize text
# -------------------------

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)


def tokenize(examples):
    return tokenizer(
        examples["text"],
        truncation=True,
        padding="max_length",
        max_length=128,
    )


train_dataset = train_dataset.map(
    tokenize, batched=True, remove_columns=["text"]
)
test_dataset = test_dataset.map(
    tokenize, batched=True, remove_columns=["text"]
)

# -------------------------
# 5. Load multi-label DistilBERT
# -------------------------

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=len(categories),
    id2label=id2label,
    label2id=label2id,
    problem_type="multi_label_classification",
)

# -------------------------
# 6. Evaluation metrics
# -------------------------

def compute_metrics(eval_pred):
    logits, targets = eval_pred

    if isinstance(logits, tuple):
        logits = logits[0]

    # Convert logits into independent probabilities
    probabilities = 1.0 / (1.0 + np.exp(-np.clip(logits, -50, 50)))

    # Initial threshold; tune it using validation data later
    predictions = (probabilities >= 0.5).astype(int)
    targets = np.asarray(targets).astype(int)

    return {
        "micro_f1": f1_score(
            targets, predictions, average="micro", zero_division=0
        ),
        "macro_f1": f1_score(
            targets, predictions, average="macro", zero_division=0
        ),
        "micro_precision": precision_score(
            targets, predictions, average="micro", zero_division=0
        ),
        "micro_recall": recall_score(
            targets, predictions, average="micro", zero_division=0
        ),
    }

# -------------------------
# 7. Training configuration
# -------------------------

training_args = TrainingArguments(
    output_dir=str(MODEL_DIR / "checkpoints"),
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=5,
    weight_decay=0.01,
    logging_steps=10,
    report_to="none",
    save_total_limit=2,
    load_best_model_at_end=True,
    metric_for_best_model="eval_macro_f1",
    greater_is_better=True,
    seed=42,
)

# -------------------------
# 8. Train and evaluate
# -------------------------

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics,
)

print("\nStarting HungerBridge multi-label training...\n")

trainer.train()

print("\nEvaluation:")
print(trainer.evaluate())

# -------------------------
# 9. Save the trained model
# -------------------------

MODEL_DIR.mkdir(parents=True, exist_ok=True)

trainer.save_model(str(MODEL_DIR))
tokenizer.save_pretrained(str(MODEL_DIR))

with open(MODEL_DIR / "label_names.json", "w", encoding="utf-8") as f:
    json.dump(categories, f, indent=2)

print("\nTraining complete!")
print("Model saved in:", MODEL_DIR)
