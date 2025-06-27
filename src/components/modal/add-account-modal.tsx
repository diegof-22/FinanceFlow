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
    { value: 'blue', label: 'Blu', class: 'bg-blue-500', gradient: 'from-blue-600/20 to-blue-800/20', text: 'text-blue-300' },
    { value: 'green', label: 'Verde', class: 'bg-green-500', gradient: 'from-green-600/20 to-green-800/20', text: 'text-green-300' },
    { value: 'purple', label: 'Viola', class: 'bg-purple-500', gradient: 'from-purple-600/20 to-purple-800/20', text: 'text-purple-300' },
    { value: 'red', label: 'Rosso', class: 'bg-red-500', gradient: 'from-red-600/20 to-red-800/20', text: 'text-red-300' },
    { value: 'orange', label: 'Arancione', class: 'bg-orange-500', gradient: 'from-orange-600/20 to-orange-800/20', text: 'text-orange-300' },
    { value: 'pink', label: 'Rosa', class: 'bg-pink-500', gradient: 'from-pink-600/20 to-pink-800/20', text: 'text-pink-300' }
  ];

const selectedColor = colorOptions.find(color => color.value === formData.color) || colorOptions[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Collega Conto" size="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div className={`bg-gradient-to-br ${selectedColor.gradient} rounded-lg p-3 border border-white/20 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-2">
            <Building className={`h-5 w-5 ${selectedColor.text}`}/>
            <span className={`text-xs font-bold tracking-wider ${selectedColor.text}`}>
              CONTO CORRENTE
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-white/70 text-xs">
              {formData.bankName || "Nome Banca"}
            </p>
            <p className="text-white font-semibold text-sm">
              {formData.accountName || "Nome Conto"}
            </p>
            <p className="text-lg font-bold text-white">
              €{formData.balance || "0.00"}
            </p>
          </div>
        </div>

        
        <div className="space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor="bankName"
                className="text-white/90 mb-1 block text-sm font-medium"
              >
                Banca
              </Label>
              <Input
                id="bankName"
                type="text"
                placeholder="Intesa"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg h-9 text-sm"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="accountName"
                className="text-white/90 mb-1 block text-sm font-medium"
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
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg h-9 text-sm"
                required
              />
            </div>
          </div>

          
          <div>
            <Label
              htmlFor="balance"
              className="text-white/90 mb-1 block text-sm font-medium"
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
              className="h-3"
            />
          </div>



          
          <div>
            <Label className="text-white/90 mb-1.5 block text-sm font-medium">
              Colore
            </Label>
            <div className="flex justify-center space-x-2">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, color: color.value })
                  }
                  className={`w-7 h-7 rounded-full ${color.class} border-2 ${
                    formData.color === color.value
                      ? "border-white scale-110"
                      : "border-transparent"
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
            variant="success"
            size="md"
            className="flex-1 h-9"
          >
            Collega
          </Button>
        </div>
      </form>
    </Modal>
  );
};