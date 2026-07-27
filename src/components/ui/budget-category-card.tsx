import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Plus, Edit3, Trash2, Check, X, MoreHorizontal } from 'lucide-react';

interface BudgetCategoryCardProps {
  title: string;
  amount: number;
  budget?: number;
  icon: LucideIcon;
  color: string;
  categoryKey: string;
  onSetBudget: (category: string, amount: number) => void;
  onRemoveBudget: (category: string) => void;
}

export const BudgetCategoryCard: React.FC<BudgetCategoryCardProps> = ({
  title,
  amount,
  budget,
  icon: Icon,
  color,
  categoryKey,
  onSetBudget,
  onRemoveBudget
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget?.toString() || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const percentage = budget ? Math.min((amount / budget) * 100, 100) : 0;
  const isOverBudget = budget ? amount > budget : false;

  const colorClasses = {
    blue: {
      border: 'border-[#f0f0f0]',
      icon: 'text-blue-500',
      progress: 'from-blue-400 to-blue-500'
    },
    green: {
      border: 'border-[#f0f0f0]',
      icon: 'text-green-500',
      progress: 'from-green-400 to-green-500'
    },
    red: {
      border: 'border-[#f0f0f0]',
      icon: 'text-red-500',
      progress: 'from-red-400 to-red-500'
    },
    yellow: {
      border: 'border-[#f0f0f0]',
      icon: 'text-yellow-500',
      progress: 'from-yellow-400 to-yellow-500'
    },
    purple: {
      border: 'border-[#f0f0f0]',
      icon: 'text-purple-500',
      progress: 'from-purple-400 to-purple-500'
    },
    pink: {
      border: 'border-[#f0f0f0]',
      icon: 'text-pink-500',
      progress: 'from-pink-400 to-pink-500'
    }
  };

  const currentColorClasses = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  const handleSaveBudget = () => {
    const budgetValue = parseFloat(budgetInput);
    if (!isNaN(budgetValue) && budgetValue > 0) {
      onSetBudget(categoryKey, budgetValue);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setBudgetInput(budget?.toString() || '');
    setIsEditing(false);
  };

  const handleRemove = () => {
    onRemoveBudget(categoryKey);
  };

  return (
    <motion.div
      className={`bg-[#ffffff] shadow-sm rounded-[32px] p-6 lg:p-8 border ${currentColorClasses.border} transition-all duration-300 min-h-[220px] flex flex-col relative`}
      whileHover={{ y: -2, scale: 1.01 }}
      layout
    >
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-[#f5f5f5]">
            <Icon className={`h-6 w-6 ${currentColorClasses.icon}`} />
          </div>
          <div>
            <h3 className="text-[#080808] font-bold text-base">{title}</h3>
          </div>
        </div>
        
        {budget && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-[#f5f5f5] transition-colors"
            >
              <MoreHorizontal className="h-5 w-5 text-[#080808]/60" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#f0f0f0] overflow-hidden z-20"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#080808] hover:bg-[#f5f5f5] flex items-center space-x-3 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 text-[#080808]/70" />
                      <span className="font-medium">Modifica Budget</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRemove();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="font-medium">Rimuovi Budget</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {isEditing && (
        <motion.div
          className="mb-4 p-4 bg-[#f9f9f9] rounded-2xl border border-[#f0f0f0]"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#080808]/40 font-medium">€</span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-white border border-[#e5e5e5] rounded-xl text-[#080808] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#080808]/5 focus:border-[#080808]/20 transition-all shadow-sm"
                autoFocus
              />
            </div>
            <button
              onClick={handleSaveBudget}
              className="p-3 rounded-xl bg-[#080808] text-white hover:bg-[#080808]/80 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-3 rounded-xl bg-white border border-[#f0f0f0] text-[#080808] hover:bg-[#f5f5f5] transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {budget && !isEditing && (
        <div className="flex-1 flex flex-col justify-end">
          <div className="mb-4 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-bold text-[#080808] tracking-tight">€{amount.toFixed(2)}</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#080808]/30 tracking-tight mx-1">/</span>
            <span className="text-3xl sm:text-4xl font-bold text-[#080808]/30 tracking-tight">€{budget.toFixed(2)}</span>
          </div>
          
          <div className="space-y-3">
            <div className="w-full h-3 sm:h-4 bg-[#f5f5f5] rounded-full overflow-hidden shadow-inner">
              <motion.div
                className={`h-full rounded-full ${
                  isOverBudget 
                    ? 'bg-red-500' 
                    : `bg-gradient-to-r ${currentColorClasses.progress}`
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isOverBudget ? 'text-red-500' : 'text-[#080808]/40'}`}>
                {percentage.toFixed(0)}% utilizzato
              </span>
              <span className={`text-xs font-bold ${
                isOverBudget ? 'text-red-500' : 'text-green-500'
              }`}>
                {isOverBudget 
                  ? `+€${(amount - budget).toFixed(2)} extra` 
                  : `€${(budget - amount).toFixed(2)} rimasti`
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {!budget && !isEditing && (
        <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-3">
            <Plus className="h-5 w-5 text-[#080808]/40" />
          </div>
          <p className="text-[#080808]/50 text-sm font-medium mb-4">Nessun budget per questa categoria</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-[#080808] text-white rounded-full text-sm font-bold transition-all hover:bg-[#080808]/80 hover:scale-105 active:scale-95 shadow-md"
          >
            Imposta Budget
          </button>
        </div>
      )}
    </motion.div>
  );
};