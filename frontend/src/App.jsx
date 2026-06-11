import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='login' element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
