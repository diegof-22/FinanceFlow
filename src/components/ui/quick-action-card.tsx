import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  color = "blue"
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-white",
      border: "border-[#f0f0f0]",
      hover: "hover:bg-[#f5f5f5] hover:border-[#e5e5e5]",
      icon: "bg-blue-50 text-blue-500",
      shadow: "hover:shadow-sm"
    },
    green: {
      bg: "bg-white",
      border: "border-[#f0f0f0]",
      hover: "hover:bg-[#f5f5f5] hover:border-[#e5e5e5]",
      icon: "bg-green-50 text-green-500",
      shadow: "hover:shadow-sm"
    },
    purple: {
      bg: "bg-white",
      border: "border-[#f0f0f0]",
      hover: "hover:bg-[#f5f5f5] hover:border-[#e5e5e5]",
      icon: "bg-purple-50 text-purple-500",
      shadow: "hover:shadow-sm"
    },
    orange: {
      bg: "bg-white",
      border: "border-[#f0f0f0]",
      hover: "hover:bg-[#f5f5f5] hover:border-[#e5e5e5]",
      icon: "bg-orange-50 text-orange-500",
      shadow: "hover:shadow-sm"
    }
  };

  const currentColor = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.button
      onClick={onClick}
      className={`
        group w-full 
        p-2 sm:p-5 
        bg-transparent sm:bg-white 
        border border-transparent sm:border-[#f0f0f0]
        hover:bg-[#f9f9f9] sm:hover:bg-[#f5f5f5] sm:hover:border-[#e5e5e5]
        rounded-[24px] sm:rounded-xl 
        transition-all duration-300 ease-out
        sm:hover:shadow-sm
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:space-x-4">
        <div className={`
          flex items-center justify-center
          w-14 h-14 sm:w-auto sm:h-auto sm:p-3 
          rounded-full sm:rounded-lg 
          ${currentColor.icon}
          transition-all duration-300
          group-hover:scale-110
          mb-2 sm:mb-0
        `}>
          <Icon className="h-6 w-6 sm:h-5 sm:w-5" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-[#080808] font-medium text-[11px] leading-tight sm:text-base sm:font-semibold sm:mb-1 transition-colors">
            {title === "Nuova Transazione" ? "Transazione" : title}
          </h3>
          <p className="hidden sm:block text-[#080808]/60 text-sm transition-colors">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};