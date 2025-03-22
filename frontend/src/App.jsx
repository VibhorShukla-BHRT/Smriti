import ImageUpload from './components/ImageUpload'
import './App.css'
import Navbar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Footer from './components/Footer'
import Rem from './Reminder/Rem'
import Auth from './pages/Auth'
import ImageGallery from './components/ImageGallery';
import Locations from './pages/Locations';
import io from 'socket.io-client';
import { useEffect } from 'react';

// Replace with your backend URL
const socket = io('http://localhost:3000', {
  path: '/socket.io/' // Must match server's path
})

function App() {
      useEffect(() => {
        if ('geolocation' in navigator) {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude, accuracy } = position.coords;
              const data = {
                latitude,
                longitude,
                accuracy,
                timestamp: Date.now()
              };
              console.log(`Sending location: lat=${latitude}, lng=${longitude}, accuracy=${accuracy}`);
              socket.emit('location-update', data);
            },
            (error) => {
              console.error('Error obtaining location:', error);
            },
            {
              enableHighAccuracy: true,
              maximumAge: 1000,
              timeout: 5000
            }
          );

          // Clean up the geolocation watcher on component unmount
          return () => {
            navigator.geolocation.clearWatch(watchId);
          };
        } else {
          console.error("Geolocation is not available on this device.");
        }
      }, []);
  return (
    <div>
    <BrowserRouter> 
      <Navbar />
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/locations' element = {<Locations/>}/>
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
