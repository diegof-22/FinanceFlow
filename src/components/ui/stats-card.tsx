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
    blue: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
    green: "from-green-500/10 to-green-600/10 border-green-500/20",
    red: "from-red-500/10 to-red-600/10 border-red-500/20",
    yellow: "from-yellow-500/10 to-yellow-600/10 border-yellow-500/20"
  };

  const changeColors = {
    increase: "text-green-400",
    decrease: "text-red-400",
    neutral: "text-white/60"
  };

  const TrendIcon = changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : null;

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-2xl border rounded-2xl p-6 ${className ?? ''} ${className ?? ''}`}
      whileHover={{ scale: 1.00 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/80 font-medium text-sm uppercase tracking-wide">{title}</h3>
        <Icon className="h-5 w-5 text-white/60" />
      </div>
      
      <div className="space-y-2">
        <p className="text-white text-3xl font-bold">{value}</p>
        <div className="flex items-center space-x-1">
          {TrendIcon && <TrendIcon className={`h-4 w-4 ${changeColors[changeType]}`} />}
          <p className={`text-sm font-medium ${changeColors[changeType]}`}>
            {change}
          </p>
        </div>
      </div>
    </motion.div>
  );
};