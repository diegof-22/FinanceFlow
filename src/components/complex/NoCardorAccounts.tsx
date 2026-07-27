import { motion } from "framer-motion";
import { CreditCard, DollarSign, Target, TrendingUp, Wallet } from "lucide-react";
import { AddCardModal, AddAccountModal } from "../ui";
import { useAuth } from "../../lib/firebase";
import { useFinanceDataContext } from "@/contexts/FinanceDataContext";
import { CardData, AccountData } from "@/types/finance";
import { useState } from "react";

export const NoCardorAccounts = () => {
  const { user } = useAuth();
  const { addCard, addAccount } = useFinanceDataContext();

 
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  const handleAddAccount = () => setIsAddAccountModalOpen(true);
  const handleAddCard = () => setIsAddCardModalOpen(true);

 
  const handleCardSubmit = async (data: CardData) => {
    try {
      const success = await addCard({
        ...data,
        balance: parseFloat(data.balance)
      });
      if (success) {
        setIsAddCardModalOpen(false);
      }
    } catch (error) {
      console.error('Error in handleCardSubmit:', error);
    }
  };

  const handleAccountSubmit = async (data: AccountData) => {
    try {
      const success = await addAccount({
        ...data,
        balance: parseFloat(data.balance)
      });
      if (success) {
        setIsAddAccountModalOpen(false);
      }
    } catch (error) {
      console.error('Error in handleAccountSubmit:', error);
    }
  };

  return (
    <div className="min-h-screen p-3 lg:p-4 flex items-center justify-center bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto w-full">
        
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#080808] mb-3">
              Benvenuto, {user?.name}! 
            </h1>
            <p className="text-[#080808]/60 text-base lg:text-lg max-w-2xl mx-auto">
              Inizia il tuo viaggio verso la libertà finanziaria
            </p>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white border border-[#f0f0f0] rounded-[32px] p-6 lg:p-8 shadow-sm">
            
            <div className="relative z-10">
              
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="flex space-x-3">
                  <div className="p-4 bg-[#f9f9f9] rounded-2xl border border-[#f0f0f0]">
                    <Wallet className="h-8 w-8 text-[#080808]" />
                  </div>
                  <div className="p-4 bg-[#f9f9f9] rounded-2xl border border-[#f0f0f0]">
                    <CreditCard className="h-8 w-8 text-[#080808]" />
                  </div>
                </div>
              </motion.div>

             
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-[#080808] mb-3">
                  Configura i tuoi conti
                </h2>
                <p className="text-[#080808]/60 text-sm lg:text-base mb-2 max-w-xl mx-auto">
                  Per iniziare a tracciare le tue finanze, collega i tuoi conti bancari e carte.
                </p>
                <p className="text-[#080808]/40 text-xs lg:text-sm">
                  È sicuro, veloce e ti aiuterà a prendere il controllo delle tue finanze
                </p>
              </motion.div>

              
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button
                  onClick={handleAddAccount}
                  className="group relative p-4 bg-white hover:bg-[#f9f9f9] border border-[#f0f0f0] rounded-[24px] transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
                      <Wallet className="h-6 w-6 text-slate-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[#080808] font-semibold text-base mb-1">Collega Conto</h3>
                      <p className="text-[#080808]/60 text-xs">Aggiungi conti correnti, risparmio</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={handleAddCard}
                  className="group relative p-4 bg-white hover:bg-[#f9f9f9] border border-[#f0f0f0] rounded-[24px] transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
                      <CreditCard className="h-6 w-6 text-slate-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[#080808] font-semibold text-base mb-1">Aggiungi Carta</h3>
                      <p className="text-[#080808]/60 text-xs">Collega carte di credito e debito</p>
                    </div>
                  </div>
                </motion.button>
              </motion.div>

             
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p className="text-[#080808]/60 text-xs mb-4 font-medium uppercase tracking-wider">
                  Una volta collegati i tuoi conti, potrai:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <motion.div
                    className="p-4 bg-[#f9f9f9] border border-[#f0f0f0] rounded-2xl"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <DollarSign className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    <p className="text-[#080808] text-xs font-semibold">Tracciare transazioni</p>
                    <p className="text-[#080808]/50 text-xs mt-1">Monitora entrate e uscite</p>
                  </motion.div>
                  
                  <motion.div
                    className="p-4 bg-[#f9f9f9] border border-[#f0f0f0] rounded-2xl"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <TrendingUp className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    <p className="text-[#080808] text-xs font-semibold">Monitorare saldi</p>
                    <p className="text-[#080808]/50 text-xs mt-1">Visualizza i tuoi progressi</p>
                  </motion.div>
                  
                  <motion.div
                    className="p-4 bg-[#f9f9f9] border border-[#f0f0f0] rounded-2xl"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Target className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    <p className="text-[#080808] text-xs font-semibold">Analizzare spese</p>
                    <p className="text-[#080808]/50 text-xs mt-1">Ottimizza il tuo budget</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </motion.div>
      </div>

     
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onSubmit={handleCardSubmit}
      />

      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSubmit={handleAccountSubmit}
      />
    </div>
  );
};
