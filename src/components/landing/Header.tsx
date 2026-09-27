import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center justify-between px-12 py-4 max-w-[1400px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
        >
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="bg-[#080808] p-1.5 rounded-xl shadow-lg"
          >
            <Wallet className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-[#080808] group-hover:text-gray-600 transition-colors">FinanceFlow</span>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="bg-[#080808] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
        >
          Accedi
        </motion.button>
      </div>
    </header>
  );
};
