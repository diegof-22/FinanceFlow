import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CreditCard, ChevronDown } from 'lucide-react';
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
    { value: 'blue', label: 'Blu', class: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', text: 'text-white' },
    { value: 'green', label: 'Verde', class: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600', text: 'text-white' },
    { value: 'purple', label: 'Viola', class: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600', text: 'text-white' },
    { value: 'red', label: 'Rosso', class: 'bg-rose-500', gradient: 'from-rose-500 to-rose-600', text: 'text-white' },
    { value: 'orange', label: 'Arancione', class: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600', text: 'text-white' },
    { value: 'zinc', label: 'Grigio', class: 'bg-zinc-800', gradient: 'from-zinc-800 to-zinc-900', text: 'text-white' }
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
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifica Carta" : "Aggiungi Carta"} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className={`bg-gradient-to-br ${selectedColor.gradient} rounded-[24px] p-5 shadow-sm transition-all duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <CreditCard className={`h-6 w-6 ${selectedColor.text}`} />
            <span className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-white/20 ${selectedColor.text}`}>
              {formData.cardType === 'credit' ? 'CREDITO' : 'DEBITO'}
            </span>
          </div>
          <div className="space-y-1">
            <p className={`${selectedColor.text} font-bold text-lg`}>
              {formData.cardName || 'Nome Carta'}
            </p>
            <p className={`text-3xl font-bold tracking-tight ${selectedColor.text} mt-2`}>
              €{formData.balance || '0.00'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardName" className="text-[#080808] mb-1.5 block text-xs font-bold">
                Nome Carta
              </Label>
              <Input
                id="cardName"
                type="text"
                placeholder="Visa Gold"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                className="bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 shadow-sm"
                required
              />
            </div>
            <div>
              <Label htmlFor="balance" className="text-[#080808] mb-1.5 block text-xs font-bold">
                Saldo Attuale
              </Label>
              <NumberInput
                value={formData.balance}
                onChange={(value) => setFormData({ ...formData, balance: value })}
                placeholder="1000.00"
                prefix="€"
                increment={50}
                min={0}
                className="shadow-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-[#080808] mb-1.5 block text-xs font-bold">Tipo</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCardTypeDropdownOpen(!isCardTypeDropdownOpen)}
                className="w-full px-4 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-[#080808] text-sm focus:outline-none focus:border-[#080808]/20 flex items-center justify-between shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className={`h-4 w-4 ${formData.cardType === 'credit' ? 'text-emerald-500' : 'text-blue-500'}`} />
                  <span className="font-medium">{formData.cardType === 'credit' ? 'Carta di Credito' : 'Carta di Debito'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-[#080808]/50 transition-transform ${isCardTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCardTypeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#f0f0f0] rounded-[20px] shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, cardType: 'credit' });
                          setIsCardTypeDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left rounded-xl transition-colors flex items-center space-x-3 ${formData.cardType === 'credit' ? 'bg-[#f5f5f5]' : 'hover:bg-[#f9f9f9]'}`}
                      >
                        <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-[#f0f0f0]`}>
                          <CreditCard className="h-4 w-4 text-emerald-500" />
                        </div>
                        <span className="text-[#080808] text-sm font-medium">Carta di Credito</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, cardType: 'debit' });
                          setIsCardTypeDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left rounded-xl transition-colors flex items-center space-x-3 ${formData.cardType === 'debit' ? 'bg-[#f5f5f5]' : 'hover:bg-[#f9f9f9]'}`}
                      >
                        <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-[#f0f0f0]`}>
                          <CreditCard className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-[#080808] text-sm font-medium">Carta di Debito</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <Label className="text-[#080808] mb-2 block text-xs font-bold">Colore Tema</Label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-full ${color.class} ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-[#080808] scale-110 shadow-md' : 'border border-black/5 opacity-80 hover:opacity-100'
                  } transition-all`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={color.label}
                />
              ))}
            </div>
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
            {initialData ? "Salva Modifiche" : "Aggiungi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};