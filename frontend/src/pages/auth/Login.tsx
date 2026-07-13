// import React from 'react'

import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="min-h-[70vh]">
      <h1 className="text-2xl">Login</h1>
      <Link to="/auth/register">
        <p>Login</p>
      </Link>
    </section>
  );
}

export default Login