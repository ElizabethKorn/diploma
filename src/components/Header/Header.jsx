import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Header.css";

const Header = ({ variant = "home", children }) => {
  return (
    <header
      className={`header ${
        variant === "tickets" ? "header-tickets" : "header-home"
      }`}
    >
      <div className="header-top">
        <div className="logo-container">
          <div className="logo">
            <Link to="/" className="logo-link">
              <h1>Лого</h1>
            </Link>
          </div>
        </div>
        <Navbar />
      </div>
      {children}
    </header>
  );
};

export default Header;
