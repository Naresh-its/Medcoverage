import React from 'react';

export default function BackgroundMotionGraphics() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Calm, soft healthcare canvas background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-[#EEF6FA] to-[#F1F5F9]" 
        style={{
          backgroundImage: `radial-gradient(#CBD5E1 0.75px, transparent 0.75px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. Soft, calm medical cyan & subtle brand ambient glows */}
      <div 
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-cyan-200/25 blur-3xl" 
      />
      <div 
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-sky-200/20 blur-3xl" 
      />
      <div 
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-rose-100/15 blur-3xl" 
      />
    </div>
  );
}