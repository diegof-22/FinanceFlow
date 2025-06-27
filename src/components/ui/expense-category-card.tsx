import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, X, Settings } from 'lucide-react';

interface ExpenseCategoryCardProps {
  title: string;
  amount: number;
  budget?: number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  onRemoveBudget?: () => void;
  onEditBudget?: () => void;
  categoryKey?: string;
}

export const ExpenseCategoryCard: React.FC<ExpenseCategoryCardProps> = ({
  title,
  amount,
  budget,
  icon: Icon,
  color,
  onClick,
  onRemoveBudget,
  onEditBudget,
  categoryKey
}) => {
  const percentage = budget ? Math.min((amount / budget) * 100, 100) : 0;
  const isOverBudget = budget ? amount > budget : false;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-600/15 to-blue-700/15',
        border: 'border-blue-400/30',
        icon: 'text-blue-400',
        progress: 'bg-blue-500',
        progressBg: 'bg-blue-500/20'
      },
      green: {
        bg: 'from-green-600/15 to-green-700/15',
        border: 'border-green-400/30',
        icon: 'text-green-400',
        progress: 'bg-green-500',
        progressBg: 'bg-green-500/20'
      },
      red: {
        bg: 'from-red-600/15 to-red-700/15',
        border: 'border-red-400/30',
        icon: 'text-red-400',
        progress: 'bg-red-500',
        progressBg: 'bg-red-500/20'
      },
      yellow: {
        bg: 'from-yellow-600/15 to-yellow-700/15',
        border: 'border-yellow-400/30',
        icon: 'text-yellow-400',
        progress: 'bg-yellow-500',
        progressBg: 'bg-yellow-500/20'
      },
      purple: {
        bg: 'from-purple-600/15 to-purple-700/15',
        border: 'border-purple-400/30',
        icon: 'text-purple-400',
        progress: 'bg-purple-500',
        progressBg: 'bg-purple-500/20'
      },
      pink: {
        bg: 'from-pink-600/15 to-pink-700/15',
        border: 'border-pink-400/30',
        icon: 'text-pink-400',
        progress: 'bg-pink-500',
        progressBg: 'bg-pink-500/20'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses.bg} rounded-xl p-4 border ${colorClasses.border} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-white/10`}>
            <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-white/60 text-xs">
              {budget ? `Budget: €${budget.toFixed(2)}` : 'Nessun budget'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className={`text-white font-bold text-lg ${isOverBudget ? 'text-red-400' : ''}`}>
              €{amount.toFixed(2)}
            </p>
            {budget && (
              <p className={`text-xs ${isOverBudget ? 'text-red-400' : 'text-white/60'}`}>
                {percentage.toFixed(0)}% del budget
              </p>
            )}
          </div>
          {budget && (onRemoveBudget || onEditBudget) && (
            <div className="flex flex-col space-y-1">
              {onEditBudget && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditBudget();
                  }}
                  className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Modifica budget"
                >
                  <Settings className="h-3 w-3 text-white/60" />
                </motion.button>
              )}
              {onRemoveBudget && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBudget();
                  }}
                  className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Rimuovi budget"
                >
                  <X className="h-3 w-3 text-red-400" />
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

      {budget && (
        <div className="space-y-2">
          <div className={`w-full h-2 ${colorClasses.progressBg} rounded-full overflow-hidden`}>
            <motion.div
              className={`h-full ${isOverBudget ? 'bg-red-500' : colorClasses.progress} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          {isOverBudget && (
            <p className="text-red-400 text-xs font-medium">
              Superato di €{(amount - budget).toFixed(2)}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};