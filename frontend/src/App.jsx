import ImageUpload from './components/ImageUpload'
import './App.css'
import Navbar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Footer from './components/Footer'
import Rem from './Reminder/Rem'
import Auth from './pages/Auth'


function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Home />
    <ImageUpload />
      <Footer />
      <Rem></Rem>
      <Auth></Auth>
      {/* <ImageUpload /> */}
    </>
  )
}

export default App
