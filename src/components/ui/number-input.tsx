import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  increment?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder = "0.00",
  min = 0,
  max,
  step = 0.01,
  increment = 10,
  prefix,
  suffix,
  className = "",
  autoFocus = false,
  disabled = false
}) => {
  const handleIncrement = () => {
    if (disabled) return;
    const currentValue = parseFloat(value) || 0;
    const newValue = currentValue + increment;
    if (max === undefined || newValue <= max) {
      onChange(newValue.toFixed(2));
    }
  };

  const handleDecrement = () => {
    if (disabled) return;
    const currentValue = parseFloat(value) || 0;
    const newValue = Math.max(min, currentValue - increment);
    onChange(newValue.toFixed(2));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const inputValue = e.target.value;
    
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleBlur = () => {
    if (disabled) return;
    const numValue = parseFloat(value) || 0;
    if (numValue < min) {
      onChange(min.toFixed(2));
    } else if (max !== undefined && numValue > max) {
      onChange(max.toFixed(2));
    }
  };

  const getHeight = () => {
    if (className.includes('h-12')) return 'h-12';
    if (className.includes('h-10')) return 'h-10';
    if (className.includes('h-8')) return 'h-8';
    return 'h-11'; 
  };

  const getButtonHeight = () => {
    if (className.includes('h-12')) return 'h-5';
    if (className.includes('h-10')) return 'h-4';
    if (className.includes('h-8')) return 'h-3';
    return 'h-[1.125rem]'; 
  };

  const inputHeight = getHeight();
  const buttonHeight = getButtonHeight();

  return (
    <div className={`relative ${inputHeight} ${className.replace(/h-\d+/, '')}`}>
      {prefix && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#080808]/40 text-sm font-medium z-10 pointer-events-none">
          {prefix}
        </span>
      )}
      
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full ${inputHeight} ${prefix ? 'pl-9' : 'pl-4'} pr-12 py-0 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-[#080808] placeholder:text-[#080808]/40 text-sm font-medium focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        min={min}
        max={max}
        step={step}
        autoFocus={autoFocus}
        disabled={disabled}
      />

      {suffix && (
        <span className="absolute right-12 top-1/2 transform -translate-y-1/2 text-[#080808]/40 text-sm font-medium z-10 pointer-events-none">
          {suffix}
        </span>
      )}

      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5">
        <motion.button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && parseFloat(value) >= max)}
          className={`${buttonHeight} w-8 px-1 rounded-t-[8px] bg-white hover:bg-[#f5f5f5] border border-[#e5e5e5] transition-colors group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center shadow-sm`}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <ChevronUp className={`h-3 w-3 ${disabled ? 'text-[#080808]/20' : 'text-[#080808]/60 group-hover:text-[#080808]'}`} />
        </motion.button>
        
        <motion.button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || parseFloat(value) <= min}
          className={`${buttonHeight} w-8 px-1 rounded-b-[8px] bg-white hover:bg-[#f5f5f5] border border-[#e5e5e5] transition-colors group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center shadow-sm`}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <ChevronDown className={`h-3 w-3 ${disabled ? 'text-[#080808]/20' : 'text-[#080808]/60 group-hover:text-[#080808]'}`} />
        </motion.button>
      </div>
    </div>
  );
};