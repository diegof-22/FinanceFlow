import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Plus, Check, X, ChevronDown } from 'lucide-react';
import { NumberInput } from './index';

interface Category {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface AddBudgetCardProps {
  categories: Category[];
  existingBudgets: { [key: string]: number };
  expensesByCategory: { [key: string]: number };
  onSetBudget: (category: string, amount: number) => void;
  showManageAllBudgetButtonMobile?: boolean;
  onManageAllBudgetsMobile?: () => void;
}

export const AddBudgetCard: React.FC<AddBudgetCardProps> = ({
  categories,
  existingBudgets,
  expensesByCategory,
  onSetBudget,
  showManageAllBudgetButtonMobile = false,
  onManageAllBudgetsMobile
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  
  const availableCategories = categories.filter(cat => !existingBudgets[cat.value]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleSaveBudget = () => {
    if (selectedCategory && budgetAmount) {
      const amount = parseFloat(budgetAmount);
      if (!isNaN(amount) && amount > 0) {
        onSetBudget(selectedCategory.value, amount);
        
        setSelectedCategory(null);
        setBudgetAmount('');
        setIsModalOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setBudgetAmount('');
    setIsModalOpen(false);
    setIsDropdownOpen(false);
  };


  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <>
      
      <motion.div
        className="bg-gradient-to-br from-white/5 via-white/2 to-transparent backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 transition-all duration-300 hover:border-white/40 min-h-[200px] flex flex-col"
        whileHover={{ y: -2, scale: 1.02 }}
      >
        <div className="text-center py-8 flex-1 flex flex-col justify-center">
          <h3 className="text-white font-semibold text-m mb-2">
            Aggiungi Budget
          </h3>
          <p className="text-white/60 text-xs mb-4">
            Imposta un limite di spesa per una categoria
          </p>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 text-green-400 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-2 mx-auto border border-green-400/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-3 w-3" />
            <span>Nuovo Budget</span>
          </motion.button>
          {showManageAllBudgetButtonMobile && (
            <button
              type="button"
              onClick={onManageAllBudgetsMobile}
              className="block sm:hidden mt-4 px-4 py-2 border border-blue-400 text-blue-400 bg-white/10 rounded-lg text-xs font-medium transition-all duration-300 mx-auto hover:bg-white/20 hover:border-blue-500 w-full"
            >
              Gestisci Tutti i Budget
            </button>
          )}
        </div>
      </motion.div>

      
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-semibold text-xl">Nuovo Budget</h3>
                <motion.button
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-red-400" />
                </motion.button>
              </div>

              <div className="space-y-6">
                
                <div className="space-y-3">
                  <label className="text-white/90 mb-2 block text-sm font-medium">Categoria</label>
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40 flex items-center justify-between h-12"
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedCategory ? (
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 rounded-lg bg-white/10">
                            <selectedCategory.icon className={`h-4 w-4 ${selectedCategory.color}`} />
                          </div>
                          <span>{selectedCategory.label}</span>
                        </div>
                      ) : (
                        <span className="text-white/50">Seleziona categoria...</span>
                      )}
                      <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                        >
                          {availableCategories.map((category) => {
                            const spent = expensesByCategory[category.value] || 0;
                            return (
                              <motion.button
                                key={category.value}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3"
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                              >
                                <div className="p-1.5 rounded-lg bg-white/10">
                                  <category.icon className={`h-4 w-4 ${category.color}`} />
                                </div>
                                <span className="text-white text-sm">{category.label}</span>
                                {spent > 0 && (
                                  <span className="text-white/50 text-xs ml-auto">€{spent.toFixed(2)}</span>
                                )}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                
                <div className="space-y-3">
                  <label className="text-white/90 mb-2 block text-sm font-medium">Budget Mensile</label>
                  <NumberInput
                    value={budgetAmount}
                    onChange={setBudgetAmount}
                    placeholder="0.00"
                    prefix="€"
                    increment={10}
                    min={0}
                    autoFocus
                    className="h-12"
                  />
                </div>

                
                <div className="flex space-x-4 pt-6">
                  <motion.button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annulla
                  </motion.button>
                  <motion.button
                    onClick={handleSaveBudget}
                    disabled={!selectedCategory || !budgetAmount}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: selectedCategory && budgetAmount ? 1.02 : 1 }}
                    whileTap={{ scale: selectedCategory && budgetAmount ? 0.98 : 1 }}
                  >
                    <Check className="h-4 w-4" />
                    <span>Salva Budget</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};