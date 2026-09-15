import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ 
        duration: 0.22, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className="w-full h-full flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}