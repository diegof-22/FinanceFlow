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
      bg: "from-blue-500/15 to-blue-600/15",
      border: "border-blue-500/20",
      hover: "hover:from-blue-500/25 hover:to-blue-600/25 hover:border-blue-400/30",
      icon: "bg-blue-500/20 text-blue-300",
      shadow: "hover:shadow-blue-500/20"
    },
    green: {
      bg: "from-green-500/15 to-green-600/15",
      border: "border-green-500/20",
      hover: "hover:from-green-500/25 hover:to-green-600/25 hover:border-green-400/30",
      icon: "bg-green-500/20 text-green-300",
      shadow: "hover:shadow-green-500/20"
    },
    purple: {
      bg: "from-purple-500/15 to-purple-600/15",
      border: "border-purple-500/20",
      hover: "hover:from-purple-500/25 hover:to-purple-600/25 hover:border-purple-400/30",
      icon: "bg-purple-500/20 text-purple-300",
      shadow: "hover:shadow-purple-500/20"
    },
    orange: {
      bg: "from-orange-500/15 to-orange-600/15",
      border: "border-orange-500/20",
      hover: "hover:from-orange-500/25 hover:to-orange-600/25 hover:border-orange-400/30",
      icon: "bg-orange-500/20 text-orange-300",
      shadow: "hover:shadow-orange-500/20"
    }
  };

  const currentColor = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.button
      onClick={onClick}
      className={`
        group w-full p-5 
        bg-gradient-to-br ${currentColor.bg} 
        border ${currentColor.border} 
        ${currentColor.hover}
        rounded-xl text-left 
        transition-all duration-300 ease-out
        hover:shadow-lg ${currentColor.shadow}
        backdrop-blur-sm
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`
          p-3 rounded-lg ${currentColor.icon}
          transition-all duration-300
          group-hover:scale-110
        `}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base mb-1 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};