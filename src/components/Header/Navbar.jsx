import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = ["О нас", "Как это работает", "Отзывы", "Контакты"];

  const handleNavClick = (item) => {
    const anchor = item.toLowerCase().replace(/\s+/g, "-");
    
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: anchor } });
    } else {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  React.useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <button
                onClick={() => handleNavClick(item)}
                className="nav-link"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;