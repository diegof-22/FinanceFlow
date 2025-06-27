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
import { Card, Account, OfflineCard, OfflineAccount } from '../../types/finance';
import { formatBalance } from '../../utils/financeHandlers';
import { NumberInput } from '../ui/number-input';

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionData: TransactionData) => Promise<boolean>;
  cards: (Card | OfflineCard)[];
  accounts: (Account | OfflineAccount)[];
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
    { value: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'text-blue-400' },
    { value: 'transport', label: 'Trasporti', icon: Car, color: 'text-green-400' },
    { value: 'home', label: 'Casa', icon: Home, color: 'text-red-400' },
    { value: 'food', label: 'Cibo & Bevande', icon: Coffee, color: 'text-yellow-400' },
    { value: 'entertainment', label: 'Intrattenimento', icon: Gamepad2, color: 'text-purple-400' },
    { value: 'health', label: 'Salute', icon: Heart, color: 'text-pink-400' }
  ];

  const incomeCategories = [
    { value: 'salary', label: 'Stipendio', icon: Briefcase, color: 'text-green-400' },
    { value: 'freelance', label: 'Freelance', icon: DollarSign, color: 'text-blue-400' },
    { value: 'investment', label: 'Investimenti', icon: TrendingUp, color: 'text-purple-400' },
    { value: 'gift', label: 'Regalo', icon: Gift, color: 'text-pink-400' },
    { value: 'other', label: 'Altro', icon: DollarSign, color: 'text-gray-400' }
  ];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;
  const selectedCategory = categories.find(cat => cat.value === formData.category);
  
  
  

  const selectedSource = formData.sourceType === 'card' 
    ? cards.find(c => c.id === formData.sourceId)
    : accounts.find(a => a.id === formData.sourceId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transazione" size="xs">
      {!hasCardsOrAccounts ? (
        
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Nessuna Carta o Conto</h3>
            <p className="text-white/70 text-sm">
              Per registrare una transazione devi prima aggiungere almeno una carta o collegare un conto bancario.
            </p>
          </div>
          
          <div className="space-y-2 pt-2">
            <Button
              onClick={onClose}
              variant="primary"
              size="md"
              className="w-full h-9"
            >
              Aggiungi Carta o Conto
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="w-full h-8"
            >
              Chiudi
            </Button>
          </div>
        </div>
      ) : (
        
        <form onSubmit={handleSubmit} className="space-y-2">
        
        <div className={`bg-gradient-to-br ${
          formData.type === 'income' 
            ? 'from-green-600/15 to-emerald-600/15' 
            : 'from-red-600/15 to-pink-600/15'
        } rounded-lg p-2.5 `}>
          <div className="flex items-center justify-between mb-1">
            {formData.type === 'income' ? (
              <TrendingUp className="h-4 w-4 text-green-300" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-300" />
            )}
            <span className={`text-xs font-bold ${
              formData.type === 'income' ? 'text-green-300' : 'text-red-300'
            }`}>
              {formData.type === 'income' ? 'ENTRATA' : 'USCITA'}
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-white font-medium text-xs truncate">
              {formData.title || 'Titolo'}
            </p>
            <p className={`text-lg font-bold ${
              formData.type === 'income' ? 'text-green-300' : 'text-red-300'
            }`}>
              {formData.type === 'income' ? '+' : '-'}€{formData.amount || '0.00'}
            </p>
          </div>
        </div>

       
        <div className="space-y-2">
          
          <div>
            <Label className="text-white/90 mb-1 block text-xs font-medium">Tipo</Label>
            <div className="grid grid-cols-2 gap-1.5">
              <motion.button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'income', category: 'salary' });
                  setIsCategoryDropdownOpen(false);
                }}
                className={`p-1.5 rounded-lg border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TrendingUp className="h-3 w-3 text-green-400 mx-auto mb-0.5" />
                <span className="text-white text-xs font-medium">Entrata</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'expense', category: 'shopping' });
                  setIsCategoryDropdownOpen(false);
                }}
                className={`p-1.5 rounded-lg border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-400 bg-red-400/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TrendingDown className="h-3 w-3 text-red-400 mx-auto mb-0.5" />
                <span className="text-white text-xs font-medium">Uscita</span>
              </motion.button>
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="title" className="text-white/90 mb-1 block text-xs font-medium">
                Titolo
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Spesa"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg h-8 text-xs"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white/90 mb-1 block text-xs font-medium">
                Importo
              </Label>
              <NumberInput
                value={formData.amount}
                onChange={(value:string) => setFormData({ ...formData, amount: value })}
                placeholder="50.00"
                prefix="€"
                increment={5}
                min={0}
                className="h-8"
              />
            </div>
          </div>

         
          <div>
            <Label className="text-white/90 mb-1 block text-xs font-medium">Categoria</Label>
            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-white/40 flex items-center justify-between h-8"
                whileTap={{ scale: 0.98 }}
              >
                {selectedCategory ? (
                  <div className="flex items-center space-x-2">
                    <selectedCategory.icon className={`h-3 w-3 ${selectedCategory.color}`} />
                    <span>{selectedCategory.label}</span>
                  </div>
                ) : (
                  <span className="text-white/50">Seleziona categoria...</span>
                )}
                <ChevronDown className={`h-3 w-3 text-white/50 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50 max-h-32 overflow-y-auto"
                  >
                    {categories.map((category) => (
                      <motion.button
                        key={category.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category: category.value });
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <category.icon className={`h-3 w-3 ${category.color}`} />
                        <span className="text-white text-xs">{category.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          
          <div>
            <Label className="text-white/90 mb-1 block text-xs font-medium">
            Carta/Conto
            </Label>
            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-white/40 flex items-center justify-between h-8"
                whileTap={{ scale: 0.98 }}
              >
                {selectedSource ? (
                  <div className="flex items-center space-x-2">
                    {formData.sourceType === 'card' ? (
                      <CreditCard className="h-3 w-3 text-blue-400" />
                    ) : (
                      <Building className="h-3 w-3 text-green-400" />
                    )}
                    <span className="truncate">
                      {formData.sourceType === 'card' 
                        ? `${(selectedSource as Card).cardName} - €${formatBalance(selectedSource.balance)}`
                        : `${(selectedSource as Account).accountName} - €${formatBalance(selectedSource.balance)}`
                      }
                    </span>
                  </div>
                ) : (
                  <span className="text-white/50">Seleziona carta o conto...</span>
                )}
                <ChevronDown className={`h-3 w-3 text-white/50 transition-transform ${isSourceDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isSourceDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                  >
                    {cards.map((card) => (
                      <motion.button
                        key={`card-${card.id}`}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, sourceId: card.id, sourceType: 'card' });
                          setIsSourceDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <CreditCard className="h-3 w-3 text-blue-400" />
                        <span className="text-white text-xs truncate">
                          {card.cardName} - €{formatBalance(card.balance)}
                        </span>
                      </motion.button>
                    ))}
                    
                   
                    {accounts.map((account) => (
                      <motion.button
                        key={`account-${account.id}`}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, sourceId: account.id, sourceType: 'account' });
                          setIsSourceDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <Building className="h-3 w-3 text-green-400" />
                        <span className="text-white text-xs truncate">
                          {account.accountName} - €{formatBalance(account.balance)}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          
          <div>
            <Label htmlFor="date" className="text-white/90 mb-1 block text-xs font-medium">
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-white/10 border-white/20 text-white rounded-lg h-8 text-xs"
              required
            />
          </div>
        </div>

       
        <div className="flex space-x-2 pt-1">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="flex-1 h-8"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            variant={formData.type === 'income' ? 'success' : 'danger'}
            size="sm"
            className="flex-1 h-8"
          >
            Aggiungi
          </Button>
        </div>
        </form>
      )}
    </Modal>
  );
};