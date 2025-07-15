// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <motion.header 
      className={`fixed w-full z-50 py-4 px-6 transition-all duration-300 ${
        scrolled ? 'bg-white/90 border-b-4 border-black' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="text-2xl font-black"
          whileHover={{ scale: 1.05 }}
        >
          <span className="bg-black text-white px-3 py-1">CLIMATIK</span>
          <span className="text-black">PRO</span>
        </motion.div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8 font-medium">
            {['Dashboard', 'Analytics', 'Forecast', 'API', 'Enterprise'].map((item) => (
              <motion.li 
                key={item}
                whileHover={{ y: -2 }}
                className="cursor-pointer hover:text-cyan-600 transition-colors"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </nav>
        
        <motion.button 
          className="bg-black text-white px-6 py-2 font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign In
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;