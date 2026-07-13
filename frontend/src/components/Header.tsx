// import React from 'react'

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between p-3 bg-black text-slate-50">
      <h1 className="font-bold ">PRO-LAAS</h1>
      <nav>
        <ul className="flex gap-6">
          <li>Home</li>
          <li>About</li>
          <li>Pricing</li>
          <li>Features</li>
          <li>Contact Us</li>
        </ul>
      </nav>
      <Link to="/auth/register">
        <button className="bg-white text-black px-5 py-1 rounded-3xl text-lg">
          Get Started
        </button>
      </Link>
    </header>
  );
}

export default Header