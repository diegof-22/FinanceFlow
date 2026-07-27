import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const dashboardScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <main ref={heroRef} className="pt-32 md:pt-40 pb-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/50 via-[#FAFAFA] to-[#FAFAFA] -z-10"></div>
      
      <div className="text-center px-4 max-w-5xl mx-auto mb-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >

          <motion.h1 
            variants={itemVariants}
            className="text-[3.5rem] md:text-[6rem] lg:text-[7rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[#080808] mb-6"
          >
            La tua gestione<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
              finanziaria.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl font-medium"
          >
            Collega tutte le tue carte, conti bancari, budget e crypto in un'unica dashboard intelligente, sicura e dal design premium.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center space-y-4">
            <motion.button 
              whileHover={{ y: -4, boxShadow: "0px 8px 0px 0px #080808" }}
              whileTap={{ y: 2, boxShadow: "0px 0px 0px 0px #080808" }}
              onClick={() => navigate('/login')}
              className="group flex items-center space-x-3 bg-[#4ade80] text-[#080808] px-8 py-4 md:px-10 md:py-4 rounded-full text-lg md:text-xl font-bold border-2 border-[#080808] transition-all"
            >
              <span>Inizia gratis ora</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        style={{ y: dashboardY, scale: dashboardScale }}
        className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 perspective-1000"
      >
        <div 
          className="absolute inset-0 translate-y-4 bg-gradient-to-r from-orange-400 via-rose-500 to-purple-600 opacity-70 rounded-md"
          style={{ filter: 'blur(70px)' }}
        ></div>
        
        <motion.div
          initial={{ opacity: 0, rotateX: 20, y: 150 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3, delay: 0.3 }}
          className="relative z-10 rounded-xl overflow-hidden border-4 border-white/60 shadow-2xl bg-white ring-1 ring-black/5"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src="/images/dashboard.png" 
              alt="FinanceFlow Dashboard" 
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
};
