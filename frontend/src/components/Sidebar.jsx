import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">My App</h2>
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
