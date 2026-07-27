import React, { useState, useEffect } from 'react';
import { X, DollarSign, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceDataContext } from '@/contexts/FinanceDataContext';
import { MarketCoin } from '@/hooks/useMarketApi';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MarketCoin | null;
}

export const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({ isOpen, onClose, asset }) => {
  const { addInvestment } = useFinanceDataContext();
  const [amount, setAmount] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (asset) {
      setEntryPrice(asset.price.toString());
      setAmount('');
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !entryPrice) return;
    
    setIsSubmitting(true);
    const success = await addInvestment({
      assetId: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: 'crypto',
      amount: parseFloat(amount),
      entryPrice: parseFloat(entryPrice)
    });
    
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const totalValue = (parseFloat(amount) || 0) * (parseFloat(entryPrice) || 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <img src={asset.image} alt={asset.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold text-[#080808]">Compra {asset.name}</h3>
                  <p className="text-sm text-[#080808]/60 uppercase">{asset.symbol}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo d'acquisto (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-gray-900"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantità (es. 0.5)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-gray-900"
                    placeholder={`Quanti ${asset.symbol.toUpperCase()}?`}
                    required
                  />
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Valore Totale</span>
                  <span className="text-gray-900 font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#080808] text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Salvataggio...' : 'Conferma Acquisto'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
