import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Uploadimage from './components/uploadImage.jsx'
import Appbar from './components/Appbar.jsx'
import Hero from './components/Hero.jsx'
import SubmitTask from './components/SubmitTask.jsx'
import Mytask from './pages/Mytask.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Appbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <div className="flex justify-center items-center mt-10">
                <Uploadimage />
              </div>
            </>
          }
        />
        <Route path="/task" element={<Mytask />} />
      </Routes>
    </>
  )
}

export default App
