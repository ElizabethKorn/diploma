import React from "react";
import Navbar from "./Navbar";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo">
          <h1>Лого</h1>
        </div>
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
