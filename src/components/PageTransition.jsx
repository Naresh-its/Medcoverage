import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`w-full h-full flex flex-col flex-1 ${className}`}
    >
      {children}
    </motion.main>
  );
}