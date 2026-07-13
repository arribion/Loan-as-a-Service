// import React from 'react'
import { Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Landing from "./pages/Landing"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App