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
    return 'h-4';
  };

  const inputHeight = getHeight();
  const buttonHeight = getButtonHeight();

  return (
    <div className={`relative ${inputHeight} ${className.replace(/h-\d+/, '')}`}>
      {prefix && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-sm z-10">
          {prefix}
        </span>
      )}
      
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full ${inputHeight} ${prefix ? 'pl-10' : 'pl-4'} pr-16 py-0 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        min={min}
        max={max}
        step={step}
        autoFocus={autoFocus}
        disabled={disabled}
      />

      {suffix && (
        <span className="absolute right-16 top-1/2 transform -translate-y-1/2 text-white/50 text-sm z-10">
          {suffix}
        </span>
      )}

      
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-px">
        <motion.button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && parseFloat(value) >= max)}
          className={`${buttonHeight} w-8 px-1 rounded-t-md bg-white/10 hover:bg-white/20 border border-white/20 border-b-0 transition-colors group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center`}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <ChevronUp className={`h-3 w-3 ${disabled ? 'text-white/30' : 'text-white/60 group-hover:text-white/90'}`} />
        </motion.button>
        
        <motion.button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || parseFloat(value) <= min}
          className={`${buttonHeight} w-8 px-1 rounded-b-md bg-white/10 hover:bg-white/20 border border-white/20 transition-colors group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center`}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <ChevronDown className={`h-3 w-3 ${disabled ? 'text-white/30' : 'text-white/60 group-hover:text-white/90'}`} />
        </motion.button>
      </div>
    </div>
  );
};