
// client/src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Background Removal Tool. All rights reserved.</p>
        <p className="mt-2 text-gray-400 text-sm">
          Built with MERN Stack and Cloudinary.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
