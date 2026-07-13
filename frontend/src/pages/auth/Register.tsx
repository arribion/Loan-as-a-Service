// import React from 'react'

import { Link } from "react-router-dom"

const Register = () => {
  return (
    <section className="min-h-[70vh]">
      <h1 className="text-2xl">Register</h1>
      <Link to="/auth/login">
      <p>Login</p></Link>
    </section>
  )
}

export default Register