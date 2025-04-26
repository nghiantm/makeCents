import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './routes/Home.jsx'
import NavBar from './components/NavBar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen w-screen p-4'>
      <NavBar />
      <Routes>
        <Route  path='/' element={<Home />} />
      </Routes>
    </div>  
  )
}

export default App
