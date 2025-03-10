import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">🖼️</span>
          <span>TI BG Removal Model</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-200 transition duration-150">
                Home
              </Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-blue-200 transition duration-150">
                History
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-200 transition duration-150">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
