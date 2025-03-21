import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import './App.css'
import Navbar from './components/NavBar'
import Home from './components/Home'
import Footer from './components/Footer'


function App() {

  return (
    <>
      <Navbar />
    <ImageUpload />
      <Footer />
      {/* <ImageUpload /> */}
    </>
  )
}

export default App
