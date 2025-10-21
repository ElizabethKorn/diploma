import React from 'react';
import './Navbar.css';

const Navbar = () => {
  const menuItems = ['О нас', 'Как это работает', 'Отзывы', 'Контакты'];
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="nav-link">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;