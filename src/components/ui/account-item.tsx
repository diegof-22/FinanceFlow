import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Building, DollarSign, Trash2, MoreVertical, Edit3 } from 'lucide-react';
import { Account } from '../../types/finance';
import { formatBalance, formatTimestamp } from '../../utils/financeHandlers';

export interface AccountItemProps {
  account: Account;
  onDelete?: (accountId: string) => void;
  onEdit?: (account: Account) => void;
}

export const AccountItem: React.FC<AccountItemProps> = ({ account, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    green: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    red: "bg-gradient-to-br from-rose-500 to-rose-600 text-white",
    orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    zinc: "bg-gradient-to-br from-zinc-800 to-zinc-900 text-white",
    pink: "bg-gradient-to-br from-pink-500 to-pink-600 text-white",
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'savings':
        return DollarSign;
      case 'investment':
        return Building;
      default:
        return Wallet;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'savings':
        return 'RISPARMIO';
      case 'investment':
        return 'INVESTIMENTI';
      default:
        return 'CORRENTE';
    }
  };

  const IconComponent = getAccountTypeIcon(account.accountType);

  return (
    <motion.div
      className={`p-5 ${colorClasses[account.color as keyof typeof colorClasses] || colorClasses.blue} rounded-[24px] shadow-sm hover:shadow-md transition-shadow`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <IconComponent className="h-6 w-6 text-white" />
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-white/20 text-white">
            {getAccountTypeLabel(account.accountType)}
          </span>
          {(onDelete || onEdit) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </button>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-8 bg-white border border-[#f0f0f0] rounded-lg shadow-lg z-10"
                >
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(account);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full text-left"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span className="text-sm">Modifica</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(account.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
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
      <div className="space-y-1 mt-4">
        <p className="text-white/80 text-sm font-medium">{account.bankName}</p>
        <h3 className="text-white font-bold text-lg">{account.accountName}</h3>
        <p className="text-3xl font-bold tracking-tight text-white mt-2">€{formatBalance(account.balance)}</p>
      </div>
    </motion.div>
  );
};