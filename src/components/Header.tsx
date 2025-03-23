
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white py-4 px-6 md:px-10 sticky top-0 z-50 shadow-sm ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate('/')}>
          <img src={logo} alt="Hermony logo" className="h-12 ml-2" />
          </button>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
            Features
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">
            Community
          </a>
          <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
            About
          </a>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors">
            Sign Up
          </button>
          <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors">
            Log In
          </button>
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">
              Community
            </a>
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </a>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors">
              Sign Up
            </button>
            <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors">
              Log In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;