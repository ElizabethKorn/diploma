import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Reviews from "./components/ReviewsComp/Reviews";

function App() {
  return (
    <div className="App">
      <div className="main-container">
        <Header />
        <Hero />
      </div>
      <About />
      <HowItWorks />
      <Reviews />
    </div>
  );
}

export default App;
