import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './routes/Home.jsx'
import NavBar from './components/NavBar'
import All from './routes/All.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=' w-screen p-4 app-background'>
      
      <div class ='main-glass-container min-h-screen'>
      <NavBar />
      <Routes>
        <Route  path='/' element={<Home />} />
        <Route path='/all' element={<All />} />
      </Routes>
      </div>
    </div>  
  )
}

export default App
