import React from "react";
import "./Hero.css";
import SearchForm from "../SearchForm/SearchForm";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-container">
          <div className="heroTitle">
            <h1 className="hero-title">
              Вся жизнь - <span className="bold-text">путешествие!</span>
            </h1>
          </div>
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
