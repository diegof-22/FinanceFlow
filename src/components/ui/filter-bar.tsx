import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Building, DollarSign, Filter } from 'lucide-react';

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
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilter,
  onFilterChange
}) => {
  return (
      <>
      
      <div className="radio-group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 inline-flex mb-4">
        {filters.map((filter, index) => {
          const IconComponent = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <motion.label
              key={filter.id}
              className="radio-option cursor-pointer relative"
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
    </>
  );
};