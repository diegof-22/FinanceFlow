import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline' | 'minimal';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', animated = true, ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent whitespace-nowrap';
    
    const variants = {
      primary: 'bg-[#080808] text-white hover:bg-[#080808]/80 shadow-sm border border-transparent focus:ring-[#080808]/50',
      secondary: 'bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#080808] border border-transparent focus:ring-[#e5e5e5]/50 shadow-sm',
      danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 focus:ring-red-500/50 shadow-sm',
      success: 'bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 focus:ring-green-500/50 shadow-sm',
      ghost: 'text-[#080808]/70 hover:text-[#080808] hover:bg-[#f5f5f5] focus:ring-[#e5e5e5]/50 border border-transparent',
      outline: 'bg-transparent hover:bg-[#f5f5f5] text-[#080808] border border-[#e5e5e5] hover:border-[#d5d5d5] focus:ring-[#e5e5e5]/50 shadow-sm',
      minimal: 'bg-transparent hover:bg-[#f5f5f5] text-[#080808]/80 hover:text-[#080808] focus:ring-[#e5e5e5]/50 border border-transparent'
    };

    const sizes = {
      xs: 'px-2 py-1 text-xs rounded-full h-6',
      sm: 'px-3 py-1.5 text-xs rounded-full h-8',
      md: 'px-4 py-2 text-sm rounded-full h-9',
      lg: 'px-6 py-3 text-base rounded-full h-11'
    };

    const finalClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;
    
    if (animated) {
      
      const { 
        onDrag, 
        onDragStart, 
        onDragEnd, 
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        ...buttonProps 
      } = props;
      
      return (
        <motion.button
          className={finalClassName}
          ref={ref}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...buttonProps}
        />
      );
    }
    
    return (
      <button
        className={finalClassName}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };