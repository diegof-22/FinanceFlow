import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Plus, Edit3, Trash2, Check, X } from 'lucide-react';

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

  const percentage = budget ? Math.min((amount / budget) * 100, 100) : 0;
  const isOverBudget = budget ? amount > budget : false;

  const colorClasses = {
    blue: {
      bg: 'from-blue-500/10 via-blue-600/5 to-transparent',
      border: 'border-blue-400/20',
      icon: 'text-blue-400',
      progress: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'from-green-500/10 via-green-600/5 to-transparent',
      border: 'border-green-400/20',
      icon: 'text-green-400',
      progress: 'from-green-500 to-green-600'
    },
    red: {
      bg: 'from-red-500/10 via-red-600/5 to-transparent',
      border: 'border-red-400/20',
      icon: 'text-red-400',
      progress: 'from-red-500 to-red-600'
    },
    yellow: {
      bg: 'from-yellow-500/10 via-yellow-600/5 to-transparent',
      border: 'border-yellow-400/20',
      icon: 'text-yellow-400',
      progress: 'from-yellow-500 to-yellow-600'
    },
    purple: {
      bg: 'from-purple-500/10 via-purple-600/5 to-transparent',
      border: 'border-purple-400/20',
      icon: 'text-purple-400',
      progress: 'from-purple-500 to-purple-600'
    },
    pink: {
      bg: 'from-pink-500/10 via-pink-600/5 to-transparent',
      border: 'border-pink-400/20',
      icon: 'text-pink-400',
      progress: 'from-pink-500 to-pink-600'
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
      className={`bg-gradient-to-br ${currentColorClasses.bg} rounded-xl p-4 border ${currentColorClasses.border} backdrop-blur-sm transition-all duration-300 min-h-[200px] flex flex-col`}
      whileHover={{ y: -2, scale: 1.02 }}
      layout
    >
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/10">
            <Icon className={`h-5 w-5 ${currentColorClasses.icon}`} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-white/60 text-xs">
              Speso: €{amount.toFixed(2)}
            </p>
          </div>
        </div>
        
       
        <div className="flex items-center space-x-1">
          {budget ? (
            <>
              <motion.button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Modifica budget"
              >
                <Edit3 className="h-3 w-3 text-white/70" />
              </motion.button>
              <motion.button
                onClick={handleRemove}
                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Rimuovi budget"
              >
                <Trash2 className="h-3 w-3 text-red-400" />
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Aggiungi budget"
            >
              <Plus className="h-3 w-3 text-green-400" />
            </motion.button>
          )}
        </div>
      </div>

      
      {isEditing && (
        <motion.div
          className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Inserisci budget..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40"
                autoFocus
              />
            </div>
            <motion.button
              onClick={handleSaveBudget}
              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Check className="h-3 w-3 text-green-400" />
            </motion.button>
            <motion.button
              onClick={handleCancelEdit}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3 w-3 text-red-400" />
            </motion.button>
          </div>
        </motion.div>
      )}

      
      {budget && !isEditing && (
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Budget mensile</span>
            <span className="text-white font-semibold text-sm">€{budget.toFixed(2)}</span>
          </div>
          
          
          <div className="space-y-2">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  isOverBudget 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : `bg-gradient-to-r ${currentColorClasses.progress}`
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isOverBudget ? 'text-red-400' : 'text-white/60'}`}>
                {percentage.toFixed(0)}% utilizzato
              </span>
              <span className={`text-xs font-medium ${
                isOverBudget ? 'text-red-400' : 'text-green-400'
              }`}>
                {isOverBudget 
                  ? `+€${(amount - budget).toFixed(2)}` 
                  : `€${(budget - amount).toFixed(2)} rimasti`
                }
              </span>
            </div>
          </div>
        </div>
      )}

      
      {!budget && !isEditing && (
        <div className="text-center py-8 flex-1 flex flex-col justify-center">
          <p className="text-white/50 text-xs mb-4">Nessun budget impostato</p>
          <motion.button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 text-green-400 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-2 mx-auto border border-green-400/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-3 w-3" />
            <span>Aggiungi Budget</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};