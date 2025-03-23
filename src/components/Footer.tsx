import React from 'react';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-purple-50 via-gray-50 to-pink-50 py-10 px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="relative bg-white/50 p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <img 
                src={logo} 
                alt="Hermony logo" 
                className="h-14 transform hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <p className="text-gray-600 playfair-display-custom text-center italic tracking-wide">
              "Empowering women in tech to weave harmony between work and life"
            </p>
          </div>

          <div className="bg-white/50 p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-purple-800 playfair-display-custom mb-4 text-lg">Discover</h3>
            <ul className="space-y-3 text-gray-700 playfair-display-custom">
              {['Smart Scheduler', 'Mentoring Hub', 'Networking', 'Career Dashboard'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-purple-600 transition-colors duration-200 hover:border-b hover:border-purple-200 pb-1"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/50 p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-purple-800 playfair-display-custom mb-4 text-lg">Our Story</h3>
            <ul className="space-y-3 text-gray-700 playfair-display-custom">
              {['About Us', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="relative hover:text-purple-600 transition-colors duration-200 group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-10 border-t border-purple-100/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 playfair-display-custom text-sm mb-4 md:mb-0 italic">
            © 2025 Hermony | Crafted with ♥ by Hrishika, Preksha, Dhanshree & Abegail
          </p>
          <div className="flex space-x-8">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="text-gray-600 playfair-display-custom hover:text-purple-600 transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-purple-100 opacity-10 clip-path-wave"></div>
    </footer>
  );
};

export default Footer;