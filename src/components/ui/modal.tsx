import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const sizeClasses = {
    xs: 'w-full max-w-sm',
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`bg-white border border-[#f0f0f0] rounded-2xl sm:rounded-[32px] shadow-2xl ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between p-5 sm:p-6 lg:p-8 pb-3 sm:pb-4 flex-shrink-0">
              <h3 className="text-[#080808] font-bold text-lg sm:text-xl lg:text-2xl">{title}</h3>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-all hover:scale-105 active:scale-95"
              >
                <X className="h-5 w-5 text-[#080808]/60" />
              </button>
            </div>
            
            <div className="p-5 sm:p-6 lg:p-8 pt-2 overflow-y-auto flex-1 hide-scroll">
              <style>{`
                .hide-scroll::-webkit-scrollbar { display: none; }
                .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};