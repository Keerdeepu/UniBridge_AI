import React, { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import { getProjectIdeas } from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await getProjectIdeas(formData);
      navigate("/projects", { state: { projects: data.projects } });
    } catch (err) {
      console.error(err);
      alert("Failed to generate projects.");
    }
    setLoading(false);
  };

  const handleLocalIdeas = async (type) => {
    // type = "moreIdeas" or "similarIdeas"
    setLoading(true);
    try {
      const res = await fetch("/ideas.json");
      const ideasData = await res.json();

      const data = ideasData[type];
      const projects = data.titles.map((title, i) => ({
        title,
        summary: data.summaries[i],
        tools: data.tools[i],
      }));

      navigate("/projects", { state: { projects } });
    } catch (err) {
      console.error(err);
      alert("Failed to load ideas from local file.");
    }
    setLoading(false);
  };

  return (
    <div className="home">
      <h1>AI Project Recommender</h1>
      <p>Get tailored project ideas based on your domain and skill level.</p>

      <ProjectForm onSubmit={handleFormSubmit} />

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => handleLocalIdeas("moreIdeas")}>
          More Ideas
        </button>
        <button onClick={() => handleLocalIdeas("similarIdeas")} style={{ marginLeft: "10px" }}>
          Similar Ideas
        </button>
      </div>

      {loading && <p>Generating AI suggestions...</p>}
    </div>
  );
}

export default Home;
