import ImageUpload from './components/ImageUpload'
import './App.css'
import Navbar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Footer from './components/Footer'
import Rem from './Reminder/Rem'
import Auth from './pages/Auth'
import ImageGallery from './components/ImageGallery';

function App() {

  return (
    <div>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path = '/' element = {<Home />}/>
        <Route path = '/imageupload' element = {<ImageUpload />}/>
        <Route path = '/auth' element = {<Auth />}/>
        <Route path = '/reminder' element = {<Rem />}/>
        <Route path = '/gallery' element = {<ImageGallery />}/>
      </Routes>
      <Footer />
      </BrowserRouter>
      </div>
  );
}

export default App
