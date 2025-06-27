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
import { Transaction, OfflineTransaction } from '../../types/finance';
import { formatDate } from '../../utils/financeHandlers';

export interface TransactionItemProps {
  transaction: Transaction | OfflineTransaction;
  showBorder?: boolean;
  onDelete?: (transactionId: string) => void;
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

  const getCategoryColor = (category: string) => {
    const colors = {
      shopping: 'text-blue-400',
      transport: 'text-green-400',
      home: 'text-red-400',
      food: 'text-yellow-400',
      entertainment: 'text-purple-400',
      health: 'text-pink-400',
      salary: 'text-green-400',
      freelance: 'text-blue-400',
      investment: 'text-purple-400',
      gift: 'text-pink-400',
      other: 'text-gray-400'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400';
  };



  const formatAmount = (amount: string, type: 'income' | 'expense') => {
    const formattedAmount = parseFloat(amount).toFixed(2);
    return type === 'income' ? `+€${formattedAmount}` : `-€${formattedAmount}`;
  };

  const IconComponent = getCategoryIcon(transaction.category);
  const iconColor = getCategoryColor(transaction.category);
  const amountColor = transaction.type === 'income' ? 'text-green-400' : 'text-red-400';

  return (
    <motion.div 
      className={`flex items-center justify-between py-4 ${showBorder ? 'border-b border-white/10' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg bg-white/5 border border-white/10`}>
          <IconComponent className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-white font-medium">{transaction.title}</p>
          <p className="text-white/60 text-sm">
            {formatDate(transaction.date)}
            {transaction.description && (
              <span className="ml-2 text-white/40">• {transaction.description}</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className={`font-semibold ${amountColor}`}>
            {formatAmount(transaction.amount.toString(), transaction.type)}
          </p>
          <p className="text-white/40 text-xs capitalize">
            {transaction.category.replace('_', ' ')}
          </p>
        </div>
        
        {onDelete && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-white/60" />
            </button>
            
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-8 bg-gray-800 border border-white/20 rounded-lg shadow-lg z-10"
              >
                <button
                  onClick={() => {
                    onDelete(transaction.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 px-2 py-1 sm:px-4 sm:py-2 border border-red-400 text-red-400 hover:bg-white/10 rounded-lg transition-colors w-full text-left text-xs sm:text-base"
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