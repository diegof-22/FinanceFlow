import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 relative overflow-hidden bg-[#080808]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Pronto a prendere<br />il controllo?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Unisciti agli utenti che stanno ottimizzando le loro finanze con FinanceFlow. Bastano solo 30 secondi.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(74,222,128,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="bg-[#4ade80] text-[#080808] px-10 py-5 rounded-full text-xl font-bold hover:bg-[#22c55e] transition-all"
          >
            Crea il tuo account gratis
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
