import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 16, 
        scale: 0.985,
        filter: 'blur(4px)'
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: 'blur(0px)'
      }}
      exit={{ 
        opacity: 0, 
        y: -12, 
        scale: 0.985,
        filter: 'blur(4px)'
      }}
      transition={{ 
        duration: 0.55, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="w-full h-full flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}