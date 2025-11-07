import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";

function ProjectsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const projects = location.state?.projects || [];
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!location.state?.projects) navigate("/");

    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem("projectHistory")) || [];
    setHistory(savedHistory);
  }, [location.state, navigate]);

const handleBookmark = (project) => {
  const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedProjects")) || [];
  // Avoid duplicate bookmarks
  const exists = savedBookmarks.find(p => p.title === project.title);
  if (exists) {
    alert("Project already bookmarked!");
    return;
  }

  const updated = [...savedBookmarks, project];
  localStorage.setItem("bookmarkedProjects", JSON.stringify(updated));
  setBookmarks(updated);
  alert("Project bookmarked!");
};


  const handleSaveHistory = (project) => {
    const updated = [...history, project];
    setHistory(updated);
    localStorage.setItem("projectHistory", JSON.stringify(updated));
    alert("Project saved to history!");
  };

  const handleCopy = (project) => {
    const text = `Title: ${project.title}\nSummary: ${project.summary}\nTools: ${project.tools}`;
    navigator.clipboard.writeText(text);
    alert("Project details copied!");
  };

  if (!projects || projects.length === 0) {
    return <p>No projects found. Go back and try again.</p>;
  }

  return (
    <div className="projects-page">
      <h1>Your Generated Project Ideas</h1>
      <button onClick={() => navigate("/")}>← Back to Form</button>

      <div className="project-list">
        {projects.map((p, i) => (
          <div key={i} style={{ position: "relative" }}>
            <ProjectCard {...p} />
            <div style={{ marginTop: "5px", display: "flex", gap: "5px" }}>
              <button onClick={() => handleBookmark(p)}>Bookmark</button>
              <button onClick={() => handleSaveHistory(p)}>Save to History</button>
              <button onClick={() => handleCopy(p)}>Copy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
