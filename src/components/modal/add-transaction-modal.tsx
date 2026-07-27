import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Car, 
  Home, 
  Coffee, 
  Gamepad2,
  Briefcase,
  Gift,
  Heart,
  Calendar,
  CreditCard,
  Building,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, Account } from '../../types/finance';
import { formatBalance } from '../../utils/financeHandlers';
import { NumberInput } from '../ui/number-input';

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionData: TransactionData) => Promise<boolean>;
  cards: Card[];
  accounts: Account[];
}

export interface TransactionData {
  title: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  sourceId: string;
  sourceType: 'card' | 'account';
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  cards,
  accounts
}) => {
  const [formData, setFormData] = useState<TransactionData>({
    title: '',
    amount: '',
    type: 'expense',
    category: 'shopping',
    date: new Date().toISOString().split('T')[0],
    description: '',
    sourceId: '',
    sourceType: 'card'
  });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const hasCardsOrAccounts = cards.length > 0 || accounts.length > 0;

  useEffect(() => {
    if (isOpen && hasCardsOrAccounts && !formData.sourceId) {
      if (cards.length > 0) {
        setFormData(prev => ({
          ...prev,
          sourceId: cards[0].id,
          sourceType: 'card'
        }));
      } else if (accounts.length > 0) {
        setFormData(prev => ({
          ...prev,
          sourceId: accounts[0].id,
          sourceType: 'account'
        }));
      }
    }
  }, [isOpen, hasCardsOrAccounts, cards, accounts, formData.sourceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.amount && formData.sourceId) {
      const success = await onSubmit(formData);
      if (success) {
        setFormData({
          title: '',
          amount: '',
          type: 'expense',
          category: 'shopping',
          date: new Date().toISOString().split('T')[0],
          description: '',
          sourceId: '',
          sourceType: 'card'
        });
        setIsCategoryDropdownOpen(false);
        setIsSourceDropdownOpen(false);
        onClose();
      }
    }
  };

  const expenseCategories = [
    { value: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'text-blue-500' },
    { value: 'transport', label: 'Trasporti', icon: Car, color: 'text-green-500' },
    { value: 'home', label: 'Casa', icon: Home, color: 'text-red-500' },
    { value: 'food', label: 'Cibo & Bevande', icon: Coffee, color: 'text-yellow-500' },
    { value: 'entertainment', label: 'Intrattenimento', icon: Gamepad2, color: 'text-purple-500' },
    { value: 'health', label: 'Salute', icon: Heart, color: 'text-pink-500' }
  ];

  const incomeCategories = [
    { value: 'salary', label: 'Stipendio', icon: Briefcase, color: 'text-green-500' },
    { value: 'freelance', label: 'Freelance', icon: DollarSign, color: 'text-blue-500' },
    { value: 'investment', label: 'Investimenti', icon: TrendingUp, color: 'text-purple-500' },
    { value: 'gift', label: 'Regalo', icon: Gift, color: 'text-pink-500' },
    { value: 'other', label: 'Altro', icon: DollarSign, color: 'text-gray-500' }
  ];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;
  const selectedCategory = categories.find(cat => cat.value === formData.category);

  const selectedSource = formData.sourceType === 'card' 
    ? cards.find(c => c.id === formData.sourceId)
    : accounts.find(a => a.id === formData.sourceId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transazione" size="sm">
      {!hasCardsOrAccounts ? (
        
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-yellow-50 border border-yellow-100">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#080808]">Nessuna Carta o Conto</h3>
            <p className="text-[#080808]/60 text-sm">
              Per registrare una transazione devi prima aggiungere almeno una carta o collegare un conto bancario.
            </p>
          </div>
          
          <div className="space-y-2 pt-4">
            <Button
              onClick={onClose}
              variant="primary"
              size="md"
              className="w-full h-11 rounded-full bg-[#080808] text-white"
            >
              Aggiungi Carta o Conto
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="w-full h-10 rounded-full text-[#080808]"
            >
              Chiudi
            </Button>
          </div>
        </div>
      ) : (
        
        <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className={`${
          formData.type === 'income' 
            ? 'bg-green-50 border-green-100' 
            : 'bg-red-50 border-red-100'
        } rounded-[24px] p-4 border transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-2">
            {formData.type === 'income' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              formData.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {formData.type === 'income' ? 'ENTRATA' : 'USCITA'}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[#080808]/70 font-semibold text-sm truncate">
              {formData.title || 'Nuova transazione...'}
            </p>
            <p className={`text-2xl font-bold tracking-tight ${
              formData.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {formData.type === 'income' ? '+' : '-'}€{formData.amount || '0.00'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          
          <div>
            <Label className="text-[#080808] mb-1.5 block text-xs font-bold">Tipo</Label>
            <div className="flex p-1 bg-[#f5f5f5] rounded-full border border-[#f0f0f0]">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'income', category: 'salary' });
                  setIsCategoryDropdownOpen(false);
                }}
                className={`flex-1 flex justify-center items-center py-2 rounded-full transition-all duration-300 ${
                  formData.type === 'income'
                    ? 'bg-white shadow-sm border border-[#e5e5e5]'
                    : 'text-[#080808]/50 hover:text-[#080808]'
                }`}
              >
                <TrendingUp className={`h-4 w-4 mr-2 ${formData.type === 'income' ? 'text-green-500' : 'opacity-50'}`} />
                <span className={`text-sm font-bold ${formData.type === 'income' ? 'text-[#080808]' : ''}`}>Entrata</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'expense', category: 'shopping' });
                  setIsCategoryDropdownOpen(false);
                }}
                className={`flex-1 flex justify-center items-center py-2 rounded-full transition-all duration-300 ${
                  formData.type === 'expense'
                    ? 'bg-white shadow-sm border border-[#e5e5e5]'
                    : 'text-[#080808]/50 hover:text-[#080808]'
                }`}
              >
                <TrendingDown className={`h-4 w-4 mr-2 ${formData.type === 'expense' ? 'text-red-500' : 'opacity-50'}`} />
                <span className={`text-sm font-bold ${formData.type === 'expense' ? 'text-[#080808]' : ''}`}>Uscita</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="title" className="text-[#080808] mb-1.5 block text-xs font-bold">
                Titolo
              </Label>
              <input
                id="title"
                type="text"
                placeholder="Spesa"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 transition-all shadow-sm"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-[#080808] mb-1.5 block text-xs font-bold">
                Importo
              </Label>
              <NumberInput
                value={formData.amount}
                onChange={(value:string) => setFormData({ ...formData, amount: value })}
                placeholder="0.00"
                prefix="€"
                increment={5}
                min={0}
                className="shadow-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-[#080808] mb-1.5 block text-xs font-bold">Categoria</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-4 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-[#080808] text-sm focus:outline-none focus:border-[#080808]/20 flex items-center justify-between shadow-sm transition-all"
              >
                {selectedCategory ? (
                  <div className="flex items-center space-x-2">
                    <selectedCategory.icon className={`h-4 w-4 ${selectedCategory.color}`} />
                    <span className="font-medium">{selectedCategory.label}</span>
                  </div>
                ) : (
                  <span className="text-[#080808]/50">Seleziona categoria...</span>
                )}
                <ChevronDown className={`h-4 w-4 text-[#080808]/50 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#f0f0f0] rounded-[20px] shadow-xl z-50 max-h-48 overflow-y-auto"
                  >
                    <div className="p-2 space-y-1">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: category.value });
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left rounded-xl transition-colors flex items-center space-x-3 ${formData.category === category.value ? 'bg-[#f5f5f5]' : 'hover:bg-[#f9f9f9]'}`}
                        >
                          <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-[#f0f0f0]`}>
                            <category.icon className={`h-4 w-4 ${category.color}`} />
                          </div>
                          <span className="text-[#080808] text-sm font-medium">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <Label className="text-[#080808] mb-1.5 block text-xs font-bold">
              Carta / Conto
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                className="w-full px-4 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-[#080808] text-sm focus:outline-none focus:border-[#080808]/20 flex items-center justify-between shadow-sm transition-all"
              >
                {selectedSource ? (
                  <div className="flex items-center space-x-2">
                    {formData.sourceType === 'card' ? (
                      <CreditCard className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Building className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className="truncate font-medium">
                      {formData.sourceType === 'card' 
                        ? `${(selectedSource as Card).cardName} - €${formatBalance(selectedSource.balance)}`
                        : `${(selectedSource as Account).accountName} - €${formatBalance(selectedSource.balance)}`
                      }
                    </span>
                  </div>
                ) : (
                  <span className="text-[#080808]/50">Seleziona carta o conto...</span>
                )}
                <ChevronDown className={`h-4 w-4 text-[#080808]/50 transition-transform ${isSourceDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSourceDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#f0f0f0] rounded-[20px] shadow-xl z-50 max-h-48 overflow-y-auto"
                  >
                    <div className="p-2 space-y-1">
                      {cards.map((card) => (
                        <button
                          key={`card-${card.id}`}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, sourceId: card.id, sourceType: 'card' });
                            setIsSourceDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left rounded-xl transition-colors flex items-center space-x-3 ${formData.sourceId === card.id ? 'bg-[#f5f5f5]' : 'hover:bg-[#f9f9f9]'}`}
                        >
                          <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-[#f0f0f0]`}>
                            <CreditCard className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-[#080808] text-sm font-medium truncate">
                            {card.cardName} <span className="text-[#080808]/50 ml-1">€{formatBalance(card.balance)}</span>
                          </span>
                        </button>
                      ))}
                      
                      {accounts.map((account) => (
                        <button
                          key={`account-${account.id}`}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, sourceId: account.id, sourceType: 'account' });
                            setIsSourceDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left rounded-xl transition-colors flex items-center space-x-3 ${formData.sourceId === account.id ? 'bg-[#f5f5f5]' : 'hover:bg-[#f9f9f9]'}`}
                        >
                          <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-[#f0f0f0]`}>
                            <Building className="h-4 w-4 text-emerald-500" />
                          </div>
                          <span className="text-[#080808] text-sm font-medium truncate">
                            {account.accountName} <span className="text-[#080808]/50 ml-1">€{formatBalance(account.balance)}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <Label htmlFor="date" className="text-[#080808] mb-1.5 block text-xs font-bold">
              Data
            </Label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 transition-all shadow-sm"
              required
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            className="flex-1 h-11 rounded-full text-[#080808] border border-[#e5e5e5] hover:bg-[#f5f5f5]"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 rounded-full bg-[#080808] text-white font-bold hover:bg-[#080808]/80 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Aggiungi
          </Button>
        </div>
        </form>
      )}
    </Modal>
  );
};