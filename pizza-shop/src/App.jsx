import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from "./pages/Home.jsx"
import Menu from "./pages/Menu.jsx"

function App() {

  return (
    <>
     <div className="max-w-480 mx-auto my-0">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/menu" element={<Menu/>}/>
        </Routes>
     </div>
    </>
  )
}

export default App
