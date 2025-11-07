import React from "react";

function ProjectCard({ title, description, tools }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <small>
        <b>Tools:</b> {Array.isArray(tools) ? tools.join(", ") : tools}
      </small>
    </div>
  );
}

export default ProjectCard;
