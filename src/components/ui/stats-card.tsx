import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = "blue",
  className
}) => {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500"
  };

  const changeColors = {
    increase: "bg-green-100 text-green-700",
    decrease: "bg-red-100 text-red-700",
    neutral: "bg-[#f5f5f5] text-[#080808]/70"
  };

  const TrendIcon = changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : null;

  return (
    <motion.div
      className={`bg-white border border-[#f0f0f0] rounded-3xl p-6 sm:p-8 ${className ?? ''}`}
      whileHover={{ scale: 1.00 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#080808]/70 font-medium text-sm sm:text-base">{title}</h3>
        <Icon className={`h-6 w-6 ${colorClasses[color as keyof typeof colorClasses]}`} />
      </div>
      
      <div className="space-y-3">
        <p className="text-[#080808] text-3xl sm:text-4xl font-semibold tracking-tight">{value}</p>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${changeColors[changeType]}`}>
            {TrendIcon && <TrendIcon className="h-3 w-3" />}
            <span>{change}</span>
          </div>
          <span className="text-[#080808]/50 text-xs sm:text-sm font-medium">rispetto al mese scorso</span>
        </div>
      </div>
    </motion.div>
  );
};