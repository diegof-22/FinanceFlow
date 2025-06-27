import { DollarSign, Wallet, CreditCard, ArrowRight, PlusIcon, TrendingUp, TrendingDown} from "lucide-react";
import { SidebarProvider } from "../contexts/SidebarContext";

import { motion } from 'framer-motion';

import { useFinanceDataContext } from "@/contexts/FinanceDataContext";
import { useState} from "react";
import { 
  AddTransactionModal,
  TransactionData
} from "@/components/modal/add-transaction-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";

import { createDashboardHandlers, type ConfirmModalState } from "@/utils/dashboardHandlers";
import { RecentTransactions } from "@/components/complex/Transactions";
import { TransactionsSkeleton } from '@/components/ui/skeleton';

export default function Transazioni() {
  
  const { isOffline, reloadOfflineData, isLoading, ...rest } = useFinanceDataContext();
  
  const {
    transactions,
    cards,
    accounts,
    addTransaction,
    deleteTransaction: removeTransaction,
    deleteCard: removeCard,
    deleteAccount: removeAccount,
    updateCard,
    updateAccount,
  } = useFinanceDataContext();
  
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  if (isLoading || cards === null || accounts === null || transactions === null) {
    return <TransactionsSkeleton />;
  }

  const hasCardsOrAccounts = cards.length > 0 || accounts.length > 0;
  

  if (!hasCardsOrAccounts) {
    return (
      <SidebarProvider>
        <div className="min-h-screen p-3 lg:p-4 flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                  Nessuna Transazione 
                </h1>
                <p className="text-white/70 text-base lg:text-lg max-w-2xl mx-auto">
                  Prima di tracciare le transazioni, configura i tuoi conti
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
                      Per iniziare a tracciare le tue transazioni, devi prima collegare almeno un conto o una carta.
                    </p>
                    <p className="text-white/50 text-xs lg:text-sm">
                      Vai alla dashboard per aggiungere i tuoi conti bancari e carte
                    </p>
                  </motion.div>
    
                  
                  <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.button
                      className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 mx-auto shadow-lg"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-base">Vai alla Dashboard</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                  </motion.div>
    
                  
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <motion.div
                      className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-400/20 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Wallet className="h-6 w-6 text-blue-400 mb-2" />
                      <h3 className="text-white font-semibold mb-1 text-sm">Collega Conti</h3>
                      <p className="text-white/60 text-xs">
                        Aggiungi i tuoi conti correnti, di risparmio e investimenti
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-400/20 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CreditCard className="h-6 w-6 text-green-400 mb-2" />
                      <h3 className="text-white font-semibold mb-1 text-sm">Aggiungi Carte</h3>
                      <p className="text-white/60 text-xs">
                        Collega le tue carte di credito e debito per il tracking completo
                      </p>
                    </motion.div>
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
        </div>
      </SidebarProvider>
    );
  }

  const handleAddTransaction = () => {
    setIsAddTransactionModalOpen(true);
  };

  const {
    handleDeleteTransaction,
    handleTransactionSubmit
  } = createDashboardHandlers(
    () => {},
    () => {},
    setIsAddTransactionModalOpen,
    () => {},
    setConfirmModal,
    null,
    null,
    () => {},
    () => {},
    addTransaction,
    addTransaction,
    addTransaction,
    () => Promise.resolve(false),
    () => Promise.resolve(false),
    removeTransaction,
    removeTransaction,
    removeTransaction,
    () => Promise.resolve(false),
    () => Promise.resolve(false),
    [],
    [],
    transactions,
    [],
    { isOpen: false, category: '', categoryName: '', budgetAmount: 0 }
  );

  return (
    <SidebarProvider>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Transazioni
                </h1>
                <p className="text-white/70 text-lg">
                  Monitora tutte le tue entrate e uscite in tempo reale
                </p>
              </div>
              
            </div>
          </motion.div>

          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-gradient-to-br from-green-600/15 to-emerald-600/15 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-300" />
                <div>
                  <p className="text-green-300 text-sm">Entrate Totali</p>
                  <p className="text-white text-xl font-bold">
                    €
                    {Array.isArray(transactions) && transactions.length > 0
                      ? (transactions
                          .filter((t) => t.type === "income")
                          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) || 0)
                          .toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-600/15 to-pink-600/15 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-8 w-8 text-red-300" />
                <div>
                  <p className="text-red-300 text-sm">Spese Totali</p>
                  <p className="text-white text-xl font-bold">
                    €
                    {Array.isArray(transactions) && transactions.length > 0
                      ? (transactions
                          .filter((t) => t.type === "expense")
                          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) || 0)
                          .toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/15 to-purple-600/15 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-blue-300" />
                <div>
                  <p className="text-blue-300 text-sm">Transazioni</p>
                  <p className="text-white text-xl font-bold">
                    {Array.isArray(transactions) ? transactions.length : 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          
          <RecentTransactions
            handleDeleteTransaction={handleDeleteTransaction}
            handleAddTransaction={handleAddTransaction}
            transactions={Array.isArray(transactions) ? transactions : []}
          />
          </div>
      </div>

      
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onSubmit={handleTransactionSubmit}
        cards={Array.isArray(cards) ? cards : []}
        accounts={Array.isArray(accounts) ? accounts : []}
      />

      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Elimina"
        cancelText="Annulla"
        type="danger"
      />
    </SidebarProvider>
  );
}