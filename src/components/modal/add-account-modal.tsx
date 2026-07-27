import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { NumberInput } from '../ui/number-input';
import { Account } from '@/types/finance';

export interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (accountData: AccountData) => void | Promise<void>;
  initialData?: Account | null;
}

export interface AccountData {
  bankName: string;
  accountName: string;
  balance: string;
  accountType: 'checking';
  color: string;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<AccountData>({
    bankName: '',
    accountName: '',
    balance: '',
    accountType: 'checking',
    color: 'blue'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        bankName: initialData.bankName,
        accountName: initialData.accountName,
        balance: initialData.balance.toString(),
        accountType: initialData.accountType,
        color: initialData.color,
      });
    } else {
      setFormData({
        bankName: '',
        accountName: '',
        balance: '',
        accountType: 'checking',
        color: 'blue'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.bankName && formData.accountName && formData.balance) {
      onSubmit(formData);
      setFormData({
        bankName: '',
        accountName: '',
        balance: '',
        accountType: 'checking',
        color: 'blue'
      });
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifica Conto" : "Collega Conto"} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className={`bg-gradient-to-br ${selectedColor.gradient} rounded-[24px] p-5 shadow-sm transition-all duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <Building className={`h-6 w-6 ${selectedColor.text}`}/>
            <span className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-white/20 ${selectedColor.text}`}>
              CONTO CORRENTE
            </span>
          </div>
          <div className="space-y-1">
            <p className={`${selectedColor.text} opacity-80 text-sm font-medium`}>
              {formData.bankName || "Nome Banca"}
            </p>
            <p className={`${selectedColor.text} font-bold text-lg`}>
              {formData.accountName || "Nome Conto"}
            </p>
            <p className={`text-3xl font-bold tracking-tight ${selectedColor.text} mt-2`}>
              €{formData.balance || "0.00"}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="bankName"
                className="text-[#080808] mb-1.5 block text-xs font-bold"
              >
                Banca
              </Label>
              <Input
                id="bankName"
                type="text"
                placeholder="Intesa, Sella, ecc."
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                className="bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 shadow-sm"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="accountName"
                className="text-[#080808] mb-1.5 block text-xs font-bold"
              >
                Nome Conto
              </Label>
              <Input
                id="accountName"
                type="text"
                placeholder="Principale"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
                className="bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 shadow-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <Label
              htmlFor="balance"
              className="text-[#080808] mb-1.5 block text-xs font-bold"
            >
              Saldo Attuale
            </Label>
            <NumberInput
              value={formData.balance}
              onChange={(value: string) => setFormData({ ...formData, balance: value })}
              placeholder="5000.00"
              prefix="€"
              increment={100}
              min={0}
              className="shadow-sm"
            />
          </div>
          
          <div>
            <Label className="text-[#080808] mb-2 block text-xs font-bold">
              Colore Tema
            </Label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, color: color.value })
                  }
                  className={`w-10 h-10 rounded-full ${color.class} ${
                    formData.color === color.value
                      ? "ring-2 ring-offset-2 ring-[#080808] scale-110 shadow-md"
                      : "border border-black/5 opacity-80 hover:opacity-100"
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
            {initialData ? "Salva Modifiche" : "Collega Conto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};