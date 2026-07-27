import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wallet, TrendingUp, CreditCard, Bell } from 'lucide-react';

export const MobileShowcase = () => {
  return (
    <section className="py-24 md:py-40 bg-white overflow-hidden relative">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-rose-100/50 blur-[120px] rounded-full opacity-60 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-20 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="inline-flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full mb-6 font-bold text-sm text-slate-700 shadow-sm border border-slate-200"
        >
          <span>Disponibile ovunque</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#080808] mb-6 leading-tight tracking-tight"
        >
          Il tuo ecosistema,<br />sempre in tasca.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Un'esperienza mobile nativa, fluida e potente esattamente come sul desktop. Controlla investimenti e budget con un solo tap.
        </motion.p>
      </div>

      
      <div className="relative flex justify-center items-center h-[550px] md:h-[700px] perspective-1000">
        
        
        <motion.div 
          initial={{ opacity: 0, x: 0, y: 50, rotateZ: 0 }}
          whileInView={{ opacity: 1, x: -160, y: 40, rotateZ: -15 }}
          whileHover={{ y: 20, rotateZ: -18, scale: 1.05 }}
          transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute z-10 w-[240px] h-[500px] md:w-[320px] md:h-[650px] bg-gradient-to-b from-blue-50 to-white rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden hidden md:block"
        >
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[30%] h-7 bg-slate-200/80 rounded-full z-30"></div>
          
          <div className="pt-20 px-5 flex flex-col h-full relative z-20">
            <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">Reliable performance<br/>every Situation</h3>
            <p className="text-xs text-slate-500 mb-8">Regain visibility and control of your traffic with powerful insights.</p>
            
            <div className="bg-[#080808] text-white py-3 px-4 rounded-full text-sm font-bold w-max mb-8">
              Get a demo →
            </div>

            <div className="flex-grow bg-white rounded-t-3xl shadow-xl border border-slate-100 p-4 relative">
              <img src="/images/chart.png" className="w-full h-full object-cover object-left opacity-30 absolute inset-0 rounded-t-3xl" />
              <div className="relative z-10 space-y-4 pt-4">
                <div className="w-full h-10 bg-slate-50 rounded-xl border border-slate-100"></div>
                <div className="w-full h-10 bg-slate-50 rounded-xl border border-slate-100"></div>
              </div>
            </div>
          </div>
        </motion.div>

        
        <motion.div 
          initial={{ opacity: 0, x: 0, y: 50, rotateZ: 0 }}
          whileInView={{ opacity: 1, x: 160, y: 40, rotateZ: 15 }}
          whileHover={{ y: 20, rotateZ: 18, scale: 1.05 }}
          transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute z-20 w-[240px] h-[500px] md:w-[320px] md:h-[650px] bg-white rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden hidden md:block"
        >
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[30%] h-7 bg-slate-200/80 rounded-full z-30"></div>
          
          <div className="pt-20 px-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Account Protect</h3>
            </div>
            <p className="text-xs text-slate-500 mb-8">Shield sensitive data using our client-side script defense with real-time monitoring.</p>
            
            <div className="flex-grow bg-slate-50 rounded-3xl p-4 border border-slate-100 relative overflow-hidden">
              
              <div className="absolute bottom-10 left-4 w-8 h-20 bg-slate-200 rounded-t-md"></div>
              <div className="absolute bottom-10 left-16 w-8 h-32 bg-orange-500 rounded-t-md shadow-[0_0_20px_rgba(249,115,22,0.4)]"></div>
              <div className="absolute bottom-10 left-28 w-8 h-16 bg-slate-200 rounded-t-md"></div>
              <div className="absolute bottom-10 left-40 w-8 h-24 bg-slate-200 rounded-t-md"></div>
              
              <div className="absolute bottom-32 left-0 right-0 border-t-2 border-dashed border-orange-300"></div>
            </div>
          </div>
        </motion.div>

        
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ duration: 0.7, type: 'spring', damping: 20, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute z-30 w-[260px] h-[550px] md:w-[340px] md:h-[700px] bg-white rounded-[3rem] md:rounded-[4rem] border-[8px] md:border-[14px] border-[#080808] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[30%] h-8 bg-[#080808] rounded-full z-30"></div>
          
          <div className="h-full flex flex-col pt-16 relative">
            <div className="px-6 mb-8 text-center">
               <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight mt-6">Advanced protection.<br/>Unrivaled trust.</h3>
               <p className="text-xs text-slate-500 font-medium">Ensure robust protection and build unparalleled trust across your entire digital landscape.</p>
               <div className="mt-6 bg-[#080808] text-white py-3 rounded-full text-sm font-bold w-full mx-auto cursor-pointer hover:bg-slate-800 transition-colors">
                  Get Started →
               </div>
            </div>

            <div className="flex-grow px-4 pb-4">
               
               <div className="grid grid-cols-2 gap-3 h-48 mb-3">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-4 flex flex-col justify-end shadow-lg shadow-orange-500/30">
                     <span className="text-white font-bold">DDoS Protect</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex flex-col justify-end">
                     <span className="text-slate-800 font-bold">Page Protect</span>
                  </div>
               </div>
               
               
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-14 bg-[#080808] rounded-full flex justify-between items-center px-6 shadow-xl">
                  <CreditCard className="w-5 h-5 text-white/50" />
                  <div className="bg-white/20 p-2 rounded-full">
                     <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <Bell className="w-5 h-5 text-white/50" />
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
