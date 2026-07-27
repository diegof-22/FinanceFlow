import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PhoneMockup = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto w-[320px] h-[650px] bg-[#1a1a1a] rounded-[3rem] p-2 shadow-2xl relative border border-[#333]"
    >
      {/* Dynamic Island / Notch area */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[26px] bg-black rounded-full z-20"></div>
      
      {/* Screen */}
      <div className="bg-[#fcfcfc] w-full h-full rounded-[2.6rem] overflow-hidden relative flex flex-col font-sans">
        <AnimatePresence mode="wait">
          <motion.div 
            key={children?.toString()} // this will animate when children change
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
