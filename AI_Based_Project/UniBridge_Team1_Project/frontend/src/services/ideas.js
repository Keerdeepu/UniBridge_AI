export async function getIdeas(type) {
  try {
    const response = await fetch("/ideas.json"); // public/ideas.json
    const data = await response.json();

    const selected = data[type];
    const projects = selected.titles.map((title, i) => ({
      title,
      summary: selected.summaries[i] || "",
      tools: selected.tools[i] || "",
    }));

    return projects;
  } catch (err) {
    console.error("Failed to load ideas.json:", err);
    return [];
  }
}
