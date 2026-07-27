import { useState, useRef, useEffect } from "react";
import { DollarSign, PlusIcon, Search, TrendingDown, TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionItem } from "@/components/ui/transaction-item";
import { Transaction } from "@/types/finance";
import { sortTransactionsByDate } from "@/utils/financeHandlers";
import { Button } from "@/components/ui/button";

interface TransactionsProps {
  handleDeleteTransaction: (transactionId:string) => void;
  handleAddTransaction: () => void;
  transactions: Transaction[];
  limit?: number;
}

export const RecentTransactions = ({ handleDeleteTransaction, handleAddTransaction, transactions, limit }: TransactionsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = sortTransactionsByDate(filteredTransactions);
  const displayTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white border border-[#f0f0f0] shadow-sm rounded-[32px] p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="flex flex-row justify-between items-center gap-1.5 sm:gap-4 mb-5 sm:mb-6 w-full">
          <h2 className="text-[15px] sm:text-2xl font-bold text-[#080808] whitespace-nowrap tracking-tight shrink-0">
            Transazioni
          </h2>
          
          <div className="flex w-auto gap-1.5 sm:gap-3 items-center justify-end">
            
            
            <div className={`bg-[#f9f9f9] p-0.5 sm:p-1 rounded-full border border-[#f0f0f0] shrink-0 transition-all duration-300 flex`}>
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                  filterType === "all" ? "bg-white shadow-sm text-[#080808]" : "text-[#080808]/60 hover:text-[#080808]"
                }`}
              >
                Tutte
              </button>
              <button
                onClick={() => setFilterType("income")}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-full transition-all flex items-center whitespace-nowrap ${
                  filterType === "income" ? "bg-green-50 text-green-700 shadow-sm" : "text-[#080808]/60 hover:text-green-600"
                }`}
              >
                <TrendingUp className="h-3 w-3 mr-1 hidden sm:block" />
                Entrate
              </button>
              <button
                onClick={() => setFilterType("expense")}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-full transition-all flex items-center whitespace-nowrap ${
                  filterType === "expense" ? "bg-red-50 text-red-700 shadow-sm" : "text-[#080808]/60 hover:text-red-600"
                }`}
              >
                <TrendingDown className="h-3 w-3 mr-1 hidden sm:block" />
                Uscite
              </button>
            </div>

            
            <div 
              className={`relative shrink-0 transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-full sm:w-64 h-7 sm:h-10' : 'w-7 h-7 sm:w-10 sm:h-10'}`}
            >
              {!isSearchExpanded ? (
                <button 
                  onClick={() => setIsSearchExpanded(true)}
                  className="w-full h-full rounded-full bg-[#f9f9f9] border border-[#f0f0f0] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors"
                >
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 text-[#080808]" />
                </button>
              ) : (
                <div className="relative w-full h-full">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-[#080808]/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cerca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-full pl-7 pr-7 sm:pl-10 sm:pr-10 py-1 sm:py-2 bg-white border border-[#e5e5e5] shadow-sm rounded-full text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#080808]/5 focus:border-[#080808]/20 transition-all"
                  />
                  <button 
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setSearchQuery("");
                    }}
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 hover:bg-[#f5f5f5] rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-[#080808]/60" />
                  </button>
                </div>
              )}
            </div>

            
            <button
              onClick={handleAddTransaction}
              className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#080808] text-white flex items-center justify-center hover:bg-[#080808]/80 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <PlusIcon className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>

          </div>
        </div>

        {displayTransactions.length > 0 ? (
          <div className="flex flex-col space-y-1">
            <AnimatePresence>
              {displayTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  showBorder={index < displayTransactions.length - 1}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-[#f9f9f9] border border-[#f0f0f0] rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                <DollarSign className="h-10 w-10 text-slate-700 relative z-10" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#080808] mb-2">
              {searchQuery || filterType !== 'all' ? 'Nessuna transazione trovata' : 'Nessuna transazione ancora'}
            </h3>
            <p className="text-[#080808]/60 mb-6 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery || filterType !== 'all' 
                ? 'Prova a cambiare i filtri o i termini di ricerca.'
                : 'Inizia aggiungendo la tua prima transazione per tenere traccia delle tue finanze!'}
            </p>
            {(!searchQuery && filterType === 'all') && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleAddTransaction}
                  className="w-full sm:w-auto rounded-xl"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  <span>Aggiungi Prima Transazione</span>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}