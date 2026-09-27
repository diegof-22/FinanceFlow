import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PiggyBank, 
  TrendingUp,
  BarChart3,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Budget', href: '/budgets', icon: PiggyBank },
  { name: 'Transazioni', href: '/transazioni', icon: BarChart3 },
  { name: 'Trading', href: '/trading', icon: TrendingUp  },
  { name: 'Profilo', href: '/profile', icon: User },
];

export function BottomNavBar() {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-6 left-4 right-4 h-16 bg-[#f9f9f9]/95 backdrop-blur-md border border-[#f0f0f0] rounded-full shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] z-50 flex items-center justify-around p-1 select-none">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <NavLink
            key={item.name}
            to={item.href}
            className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors duration-200"
          >
            {/* Active Bubble Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-x-1 inset-y-1 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#f0f0f0]/30 -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            {/* Icon Wrapper */}
            <motion.div
              animate={{ 
                scale: isActive ? 1.1 : 1,
                y: isActive ? -1 : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`h-5 w-5 mb-0.5 flex items-center justify-center ${
                isActive ? 'text-[#080808]' : 'text-[#080808]/70'
              }`}
            >
              <Icon className="h-5 w-5 stroke-[2.25]" />
            </motion.div>

            {/* Label */}
            <span 
              className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                isActive ? 'text-[#080808] font-semibold' : 'text-[#080808]/70'
              }`}
            >
              {item.name}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
}
