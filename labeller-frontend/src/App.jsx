import { useState } from 'react'
import viteLogo from '/vite.svg'
import Appbar from './components/Appbar.jsx'
import NextTask from './components/NextTask'
import Submission from './components/Submission.jsx'

function App() {
  return (
    <>
      <Appbar />
      <NextTask />
      <Submission />
    </>
  )
}

export default App
