import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <section className="about-container">
      <div className="about-intro">
        <h1>About Weave Haven</h1>
        <p>
          Born in 2025, Weave Haven curates ethically-sourced fashion that blends
          Scandinavian minimalism with bold global accents. From small ateliers to
          hand-picked indie labels, every piece tells a story.
        </p>
        <p>
          Our mission is simple: empower self-expression while championing
          artisans and sustainable practices. Thank you for weaving your story
          with us.
        </p>
      </div>

      <div className="team-section">
        <h2>Our Team – Group 12</h2>
        <div className="team-grid">
          <div className="team-card">
            <h3>Anitta Antony</h3>
            <p className="role">Frontend Architect</p>
            <p>
              Anitta led the design and implementation of Weave Haven’s responsive UI. From layout
              to interactions, she built and styled React components using CSS Grid and Flexbox,
              added Chart.js dashboards and ensured consistent experience across devices.
            </p>
          </div>

          <div className="team-card">
            <h3>Md Abu Taher</h3>
            <p className="role">Backend Engineer</p>
            <p>
              Taher built the secure REST API with Node.js and Express, added authentication with
              JWT, integrated image uploads using Multer and Sharp, and deployed to Heroku.
              He handled all backend logic and database operations with MongoDB.
            </p>
          </div>

          <div className="team-card">
            <h3>Shadman Intishar</h3>
            <p className="role">Market Research & Product Sourcing</p>
            <p>
              Shadman researched top e-commerce platforms, curated the initial product list,
              and crafted data-driven design recommendations. His insights defined layout,
              pricing strategies, and content structure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
