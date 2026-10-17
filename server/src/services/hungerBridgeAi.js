
const AI_URL =
  process.env.HUNGERBRIDGE_AI_URL || "http://127.0.0.1:8000";

export const classifyFood = async (foodName, ingredients) => {
  const response = await fetch(`${AI_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      food_name: foodName,
      ingredients,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`AI service returned ${response.status}: ${details}`);
  }

  const result = await response.json();

  console.log("AI predictions:", result.predictions);

  return result;
};
