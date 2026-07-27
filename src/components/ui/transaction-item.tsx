import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Car, 
  Home, 
  Coffee, 
  Gamepad2,
  Heart,
  Briefcase,
  DollarSign,
  TrendingUp,
  Gift,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Transaction } from '../../types/finance';
import { formatDate } from '../../utils/financeHandlers';

export interface TransactionItemProps {
  transaction: Transaction;
  showBorder?: boolean;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  showBorder = true,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const getCategoryIcon = (category: string) => {
    const icons = {
      shopping: ShoppingCart,
      transport: Car,
      home: Home,
      food: Coffee,
      entertainment: Gamepad2,
      health: Heart,
      salary: Briefcase,
      freelance: DollarSign,
      investment: TrendingUp,
      gift: Gift,
      other: DollarSign
    };
    return icons[category as keyof typeof icons] || DollarSign;
  };

  const getCategoryStyles = (category: string) => {
    const styles = {
      shopping: 'bg-blue-50 text-blue-600 border border-blue-100',
      transport: 'bg-green-50 text-green-600 border border-green-100',
      home: 'bg-red-50 text-red-600 border border-red-100',
      food: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
      entertainment: 'bg-purple-50 text-purple-600 border border-purple-100',
      health: 'bg-pink-50 text-pink-600 border border-pink-100',
      salary: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      freelance: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      investment: 'bg-violet-50 text-violet-600 border border-violet-100',
      gift: 'bg-orange-50 text-orange-600 border border-orange-100',
      other: 'bg-gray-50 text-gray-600 border border-gray-100'
    };
    return styles[category as keyof typeof styles] || 'bg-gray-50 text-gray-600 border border-gray-100';
  };



  const formatAmount = (amount: string, type: 'income' | 'expense') => {
    const formattedAmount = parseFloat(amount).toFixed(2);
    return type === 'income' ? `+€${formattedAmount}` : `-€${formattedAmount}`;
  };

  const IconComponent = getCategoryIcon(transaction.category);
  const categoryStyles = getCategoryStyles(transaction.category);
  const amountColor = transaction.type === 'income' ? 'text-green-600' : 'text-red-500';

  return (
    <motion.div 
      className={`flex items-center justify-between p-4 mb-2 bg-[#f9f9f9]/70 border border-transparent rounded-[24px] hover:bg-white hover:border-[#f0f0f0] hover:shadow-sm transition-all cursor-pointer`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4 overflow-hidden pr-2">
        <div className={`flex-shrink-0 p-2.5 sm:p-3 rounded-2xl ${categoryStyles}`}>
          <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[#080808] font-semibold text-sm sm:text-base truncate">{transaction.title}</p>
          <div className="flex items-center text-[#080808]/60 text-xs sm:text-sm mt-0.5 space-x-2 truncate">
            <span className="capitalize truncate">{transaction.description || transaction.category.replace('_', ' ')}</span>
            <span className="flex-shrink-0">•</span>
            <span className="flex-shrink-0">{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        <span className={`font-bold text-sm sm:text-base whitespace-nowrap ${amountColor}`}>
          {formatAmount(transaction.amount.toString(), transaction.type)}
        </span>
        {onDelete && (
          <div className="relative flex justify-center">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-[#f0f0f0] rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-[#080808]/60" />
            </button>
            
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-10 top-0 bg-white border border-[#e5e5e5] rounded-xl shadow-lg z-50 min-w-[120px]"
              >
                <button
                  onClick={() => {
                    onDelete(transaction.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors w-full text-left text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Elimina</span>
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};