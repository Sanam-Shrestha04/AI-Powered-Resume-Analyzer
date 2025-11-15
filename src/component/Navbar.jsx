import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="text-2xl text-gradient font-bold flex items-center">
        <img src="/logo.svg" alt="logo" className="logo" />
        <p>ResumeIQ</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
};
export default Navbar;
