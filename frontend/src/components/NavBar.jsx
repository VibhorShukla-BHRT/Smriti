import React, { useState ,} from 'react';
import { useNavigate ,} from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="fixed z-[100] top-2 rounded-[10px] px-2 mb-16 h-[4rem] w-[95%] bg-white/50 backdrop-blur-[100px] flex flex-col ml-[2.5%]">
      <div className='my-auto'>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">Smriti</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <button onClick={()=>navigate('/')} className="text-white hover:text-purple-200">Home</button>
          <button className="text-white hover:text-purple-200">About</button>
          <button className="text-white hover:text-purple-200">Features</button>
          <button className="text-white hover:text-purple-200">Contact</button>
          <button onClick = {()=>navigate('/auth')} className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
            Get Started
          </button>
        </div>

        {/* Mobile Menu hamburger*/}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/10 backdrop-blur-lg mt-2 py-4 rounded-lg shadow-lg md:hidden">
          <div className="flex flex-col space-y-4 px-4">
          <button onClick={()=>navigate('/')} className="text-white hover:text-purple-200">Home</button>
            <button className="text-white hover:text-purple-200 text-left">About</button>
            <button className="text-white hover:text-purple-200 text-left">Features</button>
            <button className="text-white hover:text-purple-200 text-left">Contact</button>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors w-full text-center">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
    </nav>
  );
}

export default Navbar;