import { Wallet, CreditCard, ArrowRight } from "lucide-react";

import { motion } from 'framer-motion';

import { useFinanceDataContext } from "@/contexts/FinanceDataContext";
import { useState} from "react";
import { 
  AddTransactionModal,
  TransactionData
} from "@/components/modal/add-transaction-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Button } from "@/components/ui/button";
import { TransactionsChart } from "@/components/ui/transactions-chart";

import { createDashboardHandlers, type ConfirmModalState } from "@/utils/dashboardHandlers";
import { RecentTransactions } from "@/components/complex/Transactions";
import { TransactionsSkeleton } from '@/components/ui/skeleton';

export default function Transazioni() {
  
  const { isLoading } = useFinanceDataContext();
  
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
      <>
        <div className="min-h-screen p-3 lg:p-4 flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#080808] mb-2">
                  Nessuna Transazione 
                </h1>
                <p className="text-[#080808]/70 text-sm sm:text-base max-w-2xl mx-auto">
                  Prima di tracciare le transazioni, configura i tuoi conti
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
                    <p className="text-[#080808]/70 text-sm lg:text-base mb-2 max-w-xl mx-auto">
                      Per iniziare a tracciare le tue transazioni, devi prima collegare almeno un conto o una carta.
                    </p>
                    <p className="text-[#080808]/50 text-xs lg:text-sm">
                      Vai alla dashboard per aggiungere i tuoi conti bancari e carte
                    </p>
                  </motion.div>
    
                  
                  <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="flex justify-center">
                      <Button variant="primary" className="group rounded-xl">
                        <span className="text-base">Vai alla Dashboard</span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
    
                  
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <motion.div
                      className="p-4 bg-[#f9f9f9] border border-[#f0f0f0] rounded-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Wallet className="h-6 w-6 text-slate-700 mb-2" />
                      <h3 className="text-[#080808] font-semibold mb-1 text-sm">Collega Conti</h3>
                      <p className="text-[#080808]/60 text-xs">
                        Aggiungi i tuoi conti correnti, di risparmio e investimenti
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className="p-4 bg-[#f9f9f9] border border-[#f0f0f0] rounded-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CreditCard className="h-6 w-6 text-slate-700 mb-2" />
                      <h3 className="text-[#080808] font-semibold mb-1 text-sm">Aggiungi Carte</h3>
                      <p className="text-[#080808]/60 text-xs">
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
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  const handleAddTransaction = () => {
    setIsAddTransactionModalOpen(true);
  };

  const {
    handleDeleteTransaction,
    handleTransactionSubmit
  } = createDashboardHandlers({
    setIsAddTransactionModalOpen,
    setConfirmModal,
    addTransaction,
    deleteTransaction: removeTransaction,
    transactions: Array.isArray(transactions) ? transactions : []
  });

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#080808] mb-1">
                  Transazioni
                </h1>
                <p className="text-[#080808]/70 text-sm sm:text-base">
                  Monitora tutte le tue entrate e uscite in tempo reale
                </p>
              </div>
              

            
            </div>
          </motion.div>

          

          
          <motion.div
          className="mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TransactionsChart transactions={Array.isArray(transactions) ? transactions : []} />
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
    </>
  );
}