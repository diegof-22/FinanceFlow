import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, CreditCard, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { PhoneMockup } from './mockups/PhoneMockup';
import { Screen } from './mockups/Screen';

const Word = ({ children }: {children: React.ReactNode}) => {
  return (
    <motion.span 
      variants={{
        hidden: { color: "#cbd5e1" },
        visible: { color: "#080808" }
      }}
      transition={{ duration: 0.2 }}
      className="mr-[0.22em] inline-block"
    >
      {children}
    </motion.span>
  );
};

export const RevealFeatures = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'budget' | 'transactions'>('dashboard');

  const words1 = "FinanceFlow è la piattaforma di nuova generazione progettata per".split(" ");
  const words2 = "ottimizzare il modo in cui il tuo capitale".split(" ");
  const words3 = "viene gestito, investito e moltiplicato.".split(" ");

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-24">
          
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="text-3xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.4] tracking-tight flex flex-wrap justify-center items-center"
          >
            {words1.map((w, i) => <Word key={'w1'+i}>{w}</Word>)}
            
            <Word>
              <span className="inline-flex items-center justify-center mx-1 md:mx-2 bg-green-100/80 backdrop-blur-sm p-2 md:p-3 rounded-2xl md:rounded-[1.2rem] align-middle border border-green-200">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </span>
            </Word>

            {words2.map((w, i) => <Word key={'w2'+i}>{w}</Word>)}

            <Word>
              <span className="inline-flex items-center justify-center mx-1 md:mx-2 bg-purple-200/80 backdrop-blur-sm p-2 md:p-3 rounded-2xl md:rounded-[1.2rem] align-middle border border-purple-300">
                <Wallet className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </span>
            </Word>

            {words3.map((w, i) => <Word key={'w3'+i}>{w}</Word>)}
          </motion.h2>
        </div>

        {/* Interactive Showcase */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 w-full max-w-6xl mx-auto">
          {/* Left: Titles */}
          <div className="flex flex-col gap-8 w-full lg:w-[250px] items-center lg:items-start">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`text-center lg:text-left transition-all duration-300 outline-none ${activeTab === 'dashboard' ? 'text-4xl md:text-5xl font-extrabold text-black lg:translate-x-4' : 'text-3xl md:text-4xl font-bold text-gray-300 hover:text-gray-400'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('budget')}
              className={`text-center lg:text-left transition-all duration-300 outline-none ${activeTab === 'budget' ? 'text-4xl md:text-5xl font-extrabold text-black lg:translate-x-4' : 'text-3xl md:text-4xl font-bold text-gray-300 hover:text-gray-400'}`}
            >
              Budget
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`text-center lg:text-left transition-all duration-300 outline-none ${activeTab === 'transactions' ? 'text-4xl md:text-5xl font-extrabold text-black lg:translate-x-4' : 'text-3xl md:text-4xl font-bold text-gray-300 hover:text-gray-400'}`}
            >
              Transazioni
            </button>
          </div>
          
          {/* Center: Phone */}
          <div className="flex-shrink-0 relative">
            {/* Subtle glow effect behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/40 to-purple-100/40 rounded-full blur-[80px] -z-10"></div>
            
            <PhoneMockup>
              {activeTab === 'dashboard' && <Screen path={"/images/dashboard-mobile.png"} alt="Dashboard Mockup" />}
              {activeTab === 'budget' && <Screen path={"/images/budget.png"} alt="Budget Mockup" />}
              {activeTab === 'transactions' && <Screen path={"/images/transactions-mobile.png"} alt="Transactions Mockup" />}
            </PhoneMockup>
          </div>
          
          {/* Right: Empty space for later */}
          <div className="w-full lg:w-[250px] hidden lg:block">
            {/* Placeholder for future content on the right */}
          </div>
        </div>

      </div>
    </section>
  );
};
