import React from "react";
import "../styles/About.css"; // Optional if you use a separate CSS file

function About() {
  return (
    <div className="about-page">
      <h1 className="about-title">About UniBridge</h1>
      <p className="about-description">
        <strong>UniBridge</strong> is an AI-powered career companion designed to help students and professionals
        discover personalized project ideas tailored to their skills, domain interests, and time availability.
      </p>

      <section className="about-section">
        <h2 className="section-title">Key Features</h2>
        <ul className="feature-list">
          <li><strong>Personalized Project Suggestions:</strong> Generate project ideas based on your domain, skill level, timeframe, and specific constraints.</li>
          <li><strong>AI-Powered Recommendations:</strong> Leverages GPT-3.5 from OpenAI to provide unique and creative project ideas.</li>
          <li><strong>More Ideas & Similar Ideas:</strong> Explore additional suggestions or ideas similar to your last projects using a curated ideas database.</li>
          <li><strong>Bookmark & Copy:</strong> Save your favorite projects locally or copy project details to clipboard.</li>
          <li><strong>Easy Navigation:</strong> Home, Projects, and About sections make the app user-friendly.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="section-title">Tech Stack</h2>
        <ul className="tech-list">
          <li><strong>Frontend:</strong> React.js, CSS, responsive design</li>
          <li><strong>Backend:</strong> FastAPI (Python) serving AI-generated suggestions</li>
          <li><strong>AI:</strong> OpenAI GPT-3.5 for project idea generation</li>
          <li><strong>Hosting:</strong> Localhost for development (optionally Vercel + Render/Heroku)</li>
          <li><strong>Data Storage:</strong> localStorage for project history and bookmarks</li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="section-title">How It Works</h2>
        <ol className="workflow-list">
          <li>Fill out the project idea form on the Home page.</li>
          <li>Submit the form to generate AI-based project ideas.</li>
          <li>View results on the Projects page, with options to bookmark or copy.</li>
          <li>Click "More Ideas" or "Similar Ideas" to explore additional curated suggestions.</li>
        </ol>
      </section>

      <section className="about-section">
        <h2 className="section-title">Purpose</h2>
        <p className="about-description">
          UniBridge empowers learners and professionals to quickly find meaningful projects
          that match their interests and skill level, making it easier to practice, learn, and
          showcase their abilities for internships, portfolios, or career growth.
        </p>
      </section>

      <p className="footer-note">
        © {new Date().getFullYear()} UniBridge – AI Career Companion
      </p>
    </div>
  );
}

export default About;
