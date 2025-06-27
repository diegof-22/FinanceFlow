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
      primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/20 focus:ring-blue-500/50 border border-transparent',
      secondary: 'bg-white/8 hover:bg-white/12 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm focus:ring-white/30 shadow-sm hover:shadow-md',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg hover:shadow-red-500/20 focus:ring-red-500/50 border border-transparent',
      success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg hover:shadow-green-500/20 focus:ring-green-500/50 border border-transparent',
      ghost: 'text-white/70 hover:text-white hover:bg-white/8 focus:ring-white/30 border border-transparent',
      outline: 'bg-transparent hover:bg-white/5 text-white border border-white/30 hover:border-white/50 focus:ring-white/30 shadow-sm hover:shadow-md',
      minimal: 'bg-transparent hover:bg-white/5 text-white/80 hover:text-white focus:ring-white/20 border border-transparent'
    };

    const sizes = {
      xs: 'px-2 py-1 text-xs rounded-md h-6',
      sm: 'px-3 py-1.5 text-xs rounded-lg h-8',
      md: 'px-4 py-2 text-sm rounded-lg h-9',
      lg: 'px-6 py-3 text-base rounded-xl h-11'
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