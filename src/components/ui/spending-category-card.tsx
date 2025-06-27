import React from 'react';
import { motion } from 'framer-motion';

export interface SpendingCategoryCardProps {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const SpendingCategoryCard: React.FC<SpendingCategoryCardProps> = ({
  category,
  amount,
  percentage,
  color,
  icon,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{category}</h3>
            <p className="text-white/60 text-xs">{percentage}% del totale</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-lg">€{amount.toFixed(2)}</p>
        </div>
      </div>
      
      
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </motion.div>
  );
};