import React, { useState } from "react";

function ProjectForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    domain: "",
    skill: "",
    timeframe: "",
    constraints: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.domain || !formData.skill || !formData.timeframe) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <label>Domain*</label>
      <select name="domain" onChange={handleChange} required>
        <option value="">Select Domain</option>
        <option>Web Development</option>
        <option>Artificial Intelligence</option>
        <option>Internet of Things</option>
        <option>Data Science</option>
        <option>Mobile App Development</option>
      </select>

      <label>Skill Level*</label>
      <select name="skill" onChange={handleChange} required>
        <option value="">Select Skill Level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <label>Timeframe*</label>
      <select name="timeframe" onChange={handleChange} required>
        <option value="">Select Timeframe</option>
        <option>Short</option>
        <option>Medium</option>
        <option>Long</option>
      </select>

      <label>Constraints (Optional)</label>
      <input
        type="text"
        name="constraints"
        placeholder="e.g. Use Python, TensorFlow, etc."
        onChange={handleChange}
      />

      <button type="submit">Generate Ideas</button>
    </form>
  );
}

export default ProjectForm;
