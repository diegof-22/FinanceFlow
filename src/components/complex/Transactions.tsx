import { DollarSign, PlusIcon} from "lucide-react";
import { motion } from 'framer-motion';
import { TransactionItem } from "@/components/ui/transaction-item";
import { Transaction, OfflineTransaction } from "@/types/finance";
import { sortTransactionsByDate } from "@/utils/financeHandlers";


interface TransactionsProps {
  handleDeleteTransaction: (transactionId:string) => void;
  handleAddTransaction: () => void;
  transactions: (Transaction | OfflineTransaction)[];
}

export const RecentTransactions = ({ handleDeleteTransaction, handleAddTransaction, transactions}: TransactionsProps) => {
 
  const sortedTransactions = sortTransactionsByDate(transactions);
  
    return (
        <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-2xl font-bold text-white">
                          Transazioni Recenti
                        </h2>
                        
                      </div>
                      {sortedTransactions.length > 0 ? (
                        <div className="space-y-0">
                          {sortedTransactions.slice(0, 10).map((transaction, index) => (
                            <TransactionItem
                              key={transaction.id}
                              transaction={transaction}
                              showBorder={index < Math.min(sortedTransactions.length - 1, 9)}
                              onDelete={handleDeleteTransaction}
                            />
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          className="text-center py-12"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 animate-pulse"></div>
                              <DollarSign className="h-10 w-10 text-blue-400 relative z-10" />
                            </div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500/30 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-purple-500/30 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-pink-500/30 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            Nessuna transazione ancora
                          </h3>
                          <p className="text-white/60 mb-6 max-w-md mx-auto">
                            Inizia aggiungendo la tua prima transazione per tenere
                            traccia delle tue finanze!
                          </p>
                          <motion.button
                            onClick={handleAddTransaction}
                            className="px-4 py-2 sm:px-8 sm:py-3 bg-white/10 border border-blue-400 text-blue-400 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto shadow-sm hover:bg-white/20 hover:border-blue-500 w-full sm:w-auto text-sm sm:text-base"
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <PlusIcon className="h-5 w-5" />
                            <span>Aggiungi Prima Transazione</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
    )
}