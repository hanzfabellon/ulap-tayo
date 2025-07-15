// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 py-4 px-6 transition-all duration-300 ${
        scrolled ? 'bg-white/90 border-b-4 border-black' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="text-2xl font-black"
        >
          <span className="bg-black text-white px-3 py-1">CLIMATIK</span>
          <span className="text-black">PRO</span>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8 font-medium">
            {['Dashboard', 'Analytics', 'Forecast', 'API', 'Enterprise'].map((item) => (
              <li 
                key={item}
                className="cursor-pointer hover:text-cyan-600 transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
        
        <button 
          className="bg-black text-white px-6 py-2 font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
        >
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;