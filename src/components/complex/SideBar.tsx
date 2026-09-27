import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PiggyBank, 
  TrendingUp,
  BarChart3,
  User, 
  ArrowLeftToLine,
  ArrowRightFromLine,
  Wallet
} from 'lucide-react';
import { 
  sidebarAnimations, 
  navigationAnimations, 
  toggleAnimations
} from '../../animations/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Budget', href: '/budgets', icon: PiggyBank },
  { name: 'Transazioni', href: '/transazioni', icon: BarChart3 },
  { name: 'Trading', href: '/trading', icon: TrendingUp  },
  { name: 'Profilo', href: '/profile', icon: User },
];

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const location = useLocation();

  return (
    <div
      className={`
        hidden lg:flex flex-col h-screen bg-[#f5f5f5] border-r border-[#f0f0f0] flex-shrink-0
        transition-all duration-300 ease-in-out overflow-x-hidden relative
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <motion.div
          className="flex flex-col items-center px-4 py-4 flex-shrink-0"
          {...sidebarAnimations.sidebarHeader(isCollapsed)}
        >
          <motion.div
            className="flex items-center"
            {...sidebarAnimations.logoContainer(isCollapsed)}
          >
            <motion.div
              className={`bg-[#080808] p-1.5 rounded-xl shadow-lg flex items-center justify-center ${
                isCollapsed ? "" : "mr-3"
              }`}
            >
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="text-[#080808] font-bold text-lg tracking-tight"
                  {...sidebarAnimations.logoText}
                >
                  FinanceFlow
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 pt-2 space-y-2 overflow-y-auto overflow-x-hidden relative">
          
          {/* Collapse/Expand Toggle (Desktop only) */}
          <div className="hidden lg:block">
            <motion.button
              onClick={toggleCollapse}
              className="relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-[#080808]/70 hover:text-[#080808] hover:bg-[#f0f0f0] w-full"
              {...toggleAnimations.toggleButton}
            >
              <motion.div
                className="flex items-center"
                {...navigationAnimations.navItem(false)}
              >
                <motion.div
                  className={`h-5 w-5 flex-shrink-0 flex items-center justify-center ${
                    isCollapsed ? "" : "mr-3"
                  }`}
                  {...toggleAnimations.toggleIcon(isCollapsed)}
                >
                  {isCollapsed ? (
                    <ArrowRightFromLine className="h-5 w-5" />
                  ) : (
                    <ArrowLeftToLine className="h-5 w-5" />
                  )}
                </motion.div>
              </motion.div>

              {isCollapsed && (
                <AnimatePresence>
                  <motion.div
                    {...navigationAnimations.navTooltip}
                  >
                    {isCollapsed ? "Espandi" : "Riduci"}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.button>
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            if (!Icon) {
              return null;
            }
            return (
              <div key={item.name} className="relative">
                {isActive && (
                  <motion.div {...navigationAnimations.activeIndicator} />
                )}

                <NavLink
                  to={item.href}
                  className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "text-[#080808] bg-[#f0f0f0] font-semibold z-10"
                      : "text-[#080808]/70 hover:text-[#080808] hover:bg-[#f0f0f0]"
                  }`}
                  title={isCollapsed ? item.name : ""}
                >
                  <motion.div
                    className="flex items-center"
                    {...navigationAnimations.navItem(isActive)}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        isCollapsed ? "" : "mr-3"
                      }`}
                    />
                    {!isCollapsed && (
                      <motion.span
                        className="truncate"
                        {...navigationAnimations.navItemText(isActive)}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </motion.div>

                  {isCollapsed && (
                    <AnimatePresence>
                      <motion.div
                        {...navigationAnimations.navTooltip}
                      >
                        {item.name}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* User Section (Hidden/Collapsed) */}
        <motion.div
          className="p-4 md:p-6 pb-24 lg:pb-6 border-t border-[#f0f0f0] flex-shrink-0 mt-auto overflow-hidden"
          {...sidebarAnimations.userSection(isCollapsed)}
        />
      </div>
    </div>
  );
}