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
    <div className="min-h-screen p-3 lg:p-4 flex items-center justify-center">
      <div className="max-w-5xl mx-auto w-full">
        
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
              Benvenuto, {user?.name}! 
            </h1>
            <p className="text-white/70 text-base lg:text-lg max-w-2xl mx-auto">
              Inizia il tuo viaggio verso la libertà finanziaria
            </p>
            
            
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500/20 rounded-full blur-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500/20 rounded-full blur-lg"></div>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 rounded-2xl p-6 lg:p-8 shadow-2xl">
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            
            <div className="relative z-10">
              
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="relative">
                  <div className="flex space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-400/30">
                      <Wallet className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-400/30">
                      <CreditCard className="h-8 w-8 text-green-400" />
                    </div>
                  </div>
                  <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl blur-lg"></div>
                </div>
              </motion.div>

             
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  Configura i tuoi conti
                </h2>
                <p className="text-white/70 text-sm lg:text-base mb-2 max-w-xl mx-auto">
                  Per iniziare a tracciare le tue finanze, collega i tuoi conti bancari e carte.
                </p>
                <p className="text-white/50 text-xs lg:text-sm">
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
                  className="group relative p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-400/30 hover:border-blue-400/50 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <Wallet className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-base mb-1">Collega Conto</h3>
                      <p className="text-white/60 text-xs">Aggiungi conti correnti, risparmio</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={handleAddCard}
                  className="group relative p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-400/30 hover:border-green-400/50 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                      <CreditCard className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-base mb-1">Aggiungi Carta</h3>
                      <p className="text-white/60 text-xs">Collega carte di credito e debito</p>
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
                <p className="text-white/60 text-xs mb-4">
                  Una volta collegati i tuoi conti, potrai:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <motion.div
                    className="p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-lg"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <DollarSign className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                    <p className="text-white/80 text-xs font-medium">Tracciare transazioni</p>
                    <p className="text-white/50 text-xs mt-1">Monitora entrate e uscite</p>
                  </motion.div>
                  
                  <motion.div
                    className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-lg"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-1" />
                    <p className="text-white/80 text-xs font-medium">Monitorare saldi</p>
                    <p className="text-white/50 text-xs mt-1">Visualizza i tuoi progressi</p>
                  </motion.div>
                  
                  <motion.div
                    className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-lg"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Target className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-white/80 text-xs font-medium">Analizzare spese</p>
                    <p className="text-white/50 text-xs mt-1">Ottimizza il tuo budget</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-purple-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-pink-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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

