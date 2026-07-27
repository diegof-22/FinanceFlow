import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const FeatureGrid = () => {
  return (
    <section className="py-24 bg-[#fcfcfc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#080808] max-w-lg leading-tight"
          >
            Pensato per la tua libertà finanziaria
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#080808]/60 text-lg md:text-xl max-w-xl leading-relaxed"
          >
            FinanceFlow si basa sulle abitudini che rendono vincente la gestione del denaro: rimanere concentrati, muoversi velocemente e puntare sempre alla massima qualità.
          </motion.p>
        </div>

        {/* Grid Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2rem] border border-[#f0f0f0] shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#e5e5e5]">
            
            {/* Feature 1 */}
            <div className="p-8 md:p-10 flex flex-col h-full hover:bg-gray-50/50 transition-colors group cursor-pointer">
              <div className="flex-grow mb-12">
                <div className="w-full aspect-[4/3] bg-[#f9f9f9] rounded-2xl border border-[#f0f0f0] overflow-hidden relative shadow-inner flex items-center justify-center mb-8">
                  <img src="/images/transactions-mobile.png" alt="Dettaglio Transazioni" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h3 className="text-xl md:text-2xl font-bold text-[#080808] max-w-[200px] leading-tight group-hover:text-black transition-colors">
                  Progettato per la gestione delle spese
                </h3>
                <div className="w-12 h-12 rounded-full border border-[#e5e5e5] flex items-center justify-center bg-white shadow-sm group-hover:scale-110 group-hover:border-black transition-all">
                  <ChevronRight className="w-6 h-6 text-[#080808]" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 md:p-10 flex flex-col h-full hover:bg-gray-50/50 transition-colors group cursor-pointer">
              <div className="flex-grow mb-12">
                <div className="w-full aspect-[4/3] bg-[#f9f9f9] rounded-2xl border border-[#f0f0f0] overflow-hidden relative shadow-inner flex items-center justify-center mb-8">
                  <img src="/images/budget.png" alt="Dettaglio Budget" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h3 className="text-xl md:text-2xl font-bold text-[#080808] max-w-[200px] leading-tight group-hover:text-black transition-colors">
                  Gestisci i tuoi obiettivi da cima a fondo
                </h3>
                <div className="w-12 h-12 rounded-full border border-[#e5e5e5] flex items-center justify-center bg-white shadow-sm group-hover:scale-110 group-hover:border-black transition-all">
                  <ChevronRight className="w-6 h-6 text-[#080808]" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 md:p-10 flex flex-col h-full hover:bg-gray-50/50 transition-colors group cursor-pointer">
              <div className="flex-grow mb-12">
                <div className="w-full aspect-[4/3] bg-[#f9f9f9] rounded-2xl border border-[#f0f0f0] overflow-hidden relative shadow-inner flex items-center justify-center mb-8">
                  <img src="/images/dashboard-mobile.png" alt="Dettaglio Dashboard" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h3 className="text-xl md:text-2xl font-bold text-[#080808] max-w-[200px] leading-tight group-hover:text-black transition-colors">
                  Costruisci abitudini finanziarie sane
                </h3>
                <div className="w-12 h-12 rounded-full border border-[#e5e5e5] flex items-center justify-center bg-white shadow-sm group-hover:scale-110 group-hover:border-black transition-all">
                  <ChevronRight className="w-6 h-6 text-[#080808]" />
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
