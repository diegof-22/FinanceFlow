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
      {/* Versione Barra Orizzontale - quando c'è spazio */}
      {!useDropdown && (
        <div className="flex justify-center">
          <div className="radio-group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 inline-flex mb-4 max-w-full overflow-hidden">
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
                  <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 relative z-10 ${
                    isActive
                      ? 'bg-white text-gray-800 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}>
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-gray-700' : ''}`} />
                    <span className="text-sm font-medium whitespace-nowrap">{filter.label}</span>
                    {filter.count > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'bg-white/15 text-white/60'
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
                ? 'bg-white/20 border-white/30' 
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              {activeFilterData && (
                <>
                  <activeFilterData.icon className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">{activeFilterData.label}</span>
                  {activeFilterData.count > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
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
              <ChevronDown className="h-5 w-5 text-white" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
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
                            ? 'bg-white text-gray-800'
                            : 'text-white hover:bg-white/10'
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
                              : 'bg-white/20 text-white'
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