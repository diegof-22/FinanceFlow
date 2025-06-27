import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CreditCard, DollarSign, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { NumberInput } from '../ui/number-input';
import { Card } from '@/types/finance';

export interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CardData) => void | Promise<void>;
  initialData?: Card | null;
}

export interface CardData {
  cardName: string;
  balance: string;
  cardType: 'credit' | 'debit';
  color: string;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<CardData>({
    cardName: '',
    balance: '',
    cardType: 'credit',
    color: 'blue'
  });
  const [isCardTypeDropdownOpen, setIsCardTypeDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardName && formData.balance) {
      onSubmit(formData);
      setFormData({
        cardName: '',
        balance: '',
        cardType: 'credit',
        color: 'blue'
      });
      setIsCardTypeDropdownOpen(false);
      onClose();
    }
  };

  const colorOptions = [
    { value: 'blue', label: 'Blu', class: 'bg-blue-500', gradient: 'from-blue-600/20 to-blue-800/20', text: 'text-blue-300' },
    { value: 'green', label: 'Verde', class: 'bg-green-500', gradient: 'from-green-600/20 to-green-800/20', text: 'text-green-300' },
    { value: 'purple', label: 'Viola', class: 'bg-purple-500', gradient: 'from-purple-600/20 to-purple-800/20', text: 'text-purple-300' },
    { value: 'red', label: 'Rosso', class: 'bg-red-500', gradient: 'from-red-600/20 to-red-800/20', text: 'text-red-300' },
    { value: 'orange', label: 'Arancione', class: 'bg-orange-500', gradient: 'from-orange-600/20 to-orange-800/20', text: 'text-orange-300' },
    { value: 'pink', label: 'Rosa', class: 'bg-pink-500', gradient: 'from-pink-600/20 to-pink-800/20', text: 'text-pink-300' }
  ];

  const selectedColor = colorOptions.find(color => color.value === formData.color) || colorOptions[0];

  useEffect(() => {
    if (initialData) {
      setFormData({
        cardName: initialData.cardName,
        cardType: initialData.cardType,
        balance: initialData.balance.toString(),
        color: initialData.color,
      });
    } else {
      setFormData({
        cardName: '',
        balance: '',
        cardType: 'credit',
        color: 'blue'
      });
    }
  }, [initialData, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aggiungi Carta" size="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div className={`bg-gradient-to-br ${selectedColor.gradient} rounded-lg p-3 border border-white/20 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-2">
            <CreditCard className={`h-5 w-5 ${selectedColor.text}`} />
            <span className={`text-xs font-bold tracking-wider ${selectedColor.text}`}>
              {formData.cardType === 'credit' ? 'CREDITO' : 'DEBITO'}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-white font-semibold text-sm">
              {formData.cardName || 'Nome Carta'}
            </p>
            <p className="text-lg font-bold text-white">
              €{formData.balance || '0.00'}
            </p>
          </div>
        </div>

        
        <div className="space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cardName" className="text-white/90 mb-1 block text-sm font-medium">
                Nome Carta
              </Label>
              <Input
                id="cardName"
                type="text"
                placeholder="Visa Gold"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg h-9 text-sm py-0"
                required
              />
            </div>
            <div>
              <Label htmlFor="balance" className="text-white/90 mb-1 block text-sm font-medium">
                Saldo
              </Label>
              <NumberInput
                value={formData.balance}
                onChange={(value) => setFormData({ ...formData, balance: value })}
                placeholder="1000.00"
                prefix="€"
                increment={50}
                min={0}
                className="h-9"
              />
            </div>
          </div>

          
          <div>
            <Label className="text-white/90 mb-1 block text-sm font-medium">Tipo</Label>
            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setIsCardTypeDropdownOpen(!isCardTypeDropdownOpen)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40 flex items-center justify-between h-9"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className={`h-4 w-4 ${formData.cardType === 'credit' ? 'text-green-400' : 'text-blue-400'}`} />
                  <span>{formData.cardType === 'credit' ? 'Carta di Credito' : 'Carta di Debito'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${isCardTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isCardTypeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, cardType: 'credit' });
                        setIsCardTypeDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <CreditCard className="h-4 w-4 text-green-400" />
                      <span className="text-white text-sm">Carta di Credito</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, cardType: 'debit' });
                        setIsCardTypeDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <CreditCard className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">Carta di Debito</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        
          <div>
            <Label className="text-white/90 mb-1.5 block text-sm font-medium">Colore</Label>
            <div className="flex justify-center space-x-2">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-7 h-7 rounded-full ${color.class} border-2 ${
                    formData.color === color.value ? 'border-white scale-110' : 'border-transparent'
                  } transition-all`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        
        <div className="flex space-x-3 pt-1">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1 h-9"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1 h-9"
          >
            Aggiungi
          </Button>
        </div>
      </form>
    </Modal>
  );
};