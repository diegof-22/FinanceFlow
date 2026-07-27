import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, Building, DollarSign, Filter, ChevronDown } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count: number;
}

export interface FilterBarProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [useDropdown, setUseDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFilterData = filters.find(filter => filter.id === activeFilter);

  
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        
        const estimatedWidth = 652 
        setUseDropdown(estimatedWidth > containerWidth);
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    
    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [filters.length]);

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      
      {!useDropdown && (
        <div className="flex justify-left">
          <div className="radio-group bg-[#f9f9f9] border border-[#f0f0f0] rounded-full p-1 inline-flex mb-4 max-w-full overflow-hidden">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.id;
              
              return (
                <motion.label
                  key={filter.id}
                  className="radio-option cursor-pointer relative flex-shrink-0"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="filter-radio"
                    value={filter.id}
                    checked={isActive}
                    onChange={() => onFilterChange(filter.id)}
                    className="sr-only"
                  />
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 relative z-10 ${
                    isActive
                      ? 'bg-white text-[#080808] shadow-sm'
                      : 'text-[#080808]/70 hover:text-[#080808] hover:bg-white/50'
                  }`}>
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-[#080808]' : ''}`} />
                    <span className="text-sm font-medium whitespace-nowrap">{filter.label}</span>
                    {filter.count > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'bg-[#e5e5e5] text-[#080808]/60'
                      }`}>
                        {filter.count}
                      </span>
                    )}
                  </div>
                </motion.label>
              );
            })}
          </div>
        </div>
      )}

      {useDropdown && (
        <div className="mb-4"> 
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
              isOpen 
                ? 'bg-white border-[#e5e5e5]' 
                : 'bg-[#f5f5f5] border-[#f0f0f0] hover:bg-[#f0f0f0]'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              {activeFilterData && (
                <>
                  <activeFilterData.icon className="h-5 w-5 text-[#080808]" />
                  <span className="text-[#080808] font-medium">{activeFilterData.label}</span>
                  {activeFilterData.count > 0 && (
                    <span className="bg-[#e5e5e5] text-[#080808] text-xs px-2 py-1 rounded-full">
                      {activeFilterData.count}
                    </span>
                  )}
                </>
              )}
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-[#080808]" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white border border-[#f0f0f0] rounded-xl overflow-hidden shadow-sm"
              >
                <div className="p-2 space-y-1">
                  {filters.map((filter) => {
                    const IconComponent = filter.icon;
                    const isActive = activeFilter === filter.id;
                    
                    return (
                      <motion.button
                        key={filter.id}
                        onClick={() => {
                          onFilterChange(filter.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-[#f5f5f5] text-[#080808]'
                            : 'text-[#080808]/70 hover:bg-[#f5f5f5] hover:text-[#080808]'
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-medium">{filter.label}</span>
                        </div>
                        {filter.count > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isActive 
                              ? 'bg-gray-200 text-gray-700' 
                              : 'bg-[#e5e5e5] text-[#080808]/70'
                          }`}>
                            {filter.count}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};