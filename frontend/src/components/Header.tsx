// import React from 'react'

const Header = () => {
  return (
    <header className="flex justify-between p-4 bg-black text-slate-50">
      <h1 className="font-bold ">PRO-LAAS</h1>
      <nav>
        <ul className="flex gap-6">
          <li>Home</li>
          <li>About</li>
          <li> pricing</li>
        </ul>
      </nav>
      <button>Get Started</button>
    </header>
  );
}

export default Header