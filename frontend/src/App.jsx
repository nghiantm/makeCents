import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './routes/Home.jsx'
import NavBar from './components/NavBar'
import All from './routes/All.jsx'
import UserCardRanking from './routes/UserCardRanking.jsx'
import Wallet from './routes/Wallet.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=' w-screen p-4 app-background'>
      
      <div class ='main-glass-container min-h-screen'>
      <NavBar />
      <Routes>
        <Route  path='/' element={<Wallet />} />
        <Route path='/all' element={<All />} />
        <Route path='/user-ranking' element={<UserCardRanking />} />
      </Routes>
      </div>
    </div>  
  )
}

export default App
