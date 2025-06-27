import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Trash2, MoreVertical, Edit3 } from 'lucide-react';
import { Card } from '../../types/finance';
import { formatBalance, formatTimestamp } from '../../utils/financeHandlers';

export interface CardItemProps {
  card: Card;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/30 border-blue-500/30",
    green: "from-green-500/20 to-green-600/30 border-green-500/30",
    purple: "from-purple-500/20 to-purple-600/30 border-purple-500/30",
    red: "from-red-500/20 to-red-600/30 border-red-500/30",
    orange: "from-orange-500/20 to-orange-600/30 border-orange-500/30",
    pink: "from-pink-500/20 to-pink-600/30 border-pink-500/30"
  };



  return (
    <motion.div
      className={`p-4 bg-gradient-to-br ${colorClasses[card.color as keyof typeof colorClasses]} border rounded-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <CreditCard className="h-6 w-6 text-white/70" />
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-xs font-medium">
            {card.cardType === 'credit' ? 'CREDITO' : 'DEBITO'}
          </span>
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
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(card);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors w-full text-left"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span className="text-sm">Modifica</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(card.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors w-full text-left"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Elimina</span>
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white font-semibold">{card.cardName}</h3>
        <p className="text-2xl font-bold text-white">€{formatBalance(card.balance)}</p>
        <div className="flex items-center space-x-1 text-white/50 text-xs">
          <Calendar className="h-3 w-3" />
          <span>{formatTimestamp(card.createdAt) === 'Data non disponibile' ? '—' : formatTimestamp(card.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};