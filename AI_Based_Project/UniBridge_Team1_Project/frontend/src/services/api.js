const BASE_URL = "http://127.0.0.1:8000"; // change if backend runs elsewhere

export async function getProjectIdeas(formData) {
  const response = await fetch(`${BASE_URL}/generate-ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project ideas");
  }
  return await response.json();
}
