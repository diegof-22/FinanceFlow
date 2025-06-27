import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/firebase';
import { useSidebar } from '../../contexts/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PiggyBank, 
  Target, 
  TrendingUp,
  BarChart3,
  User, 
  LogOut,
  Menu,
  X,
  ArrowLeftToLine,
  ArrowRightFromLine
} from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { 
  sidebarAnimations, 
  navigationAnimations, 
  toggleAnimations, 
  userAnimations, 
  logoutAnimations,
  sidebarPresets 
} from '../../animations/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Budget', href: '/budgets', icon: PiggyBank },
  { name: 'Transazioni', href: '/transazioni', icon: BarChart3 },
  { name: 'Trading', href: '/trading', icon: TrendingUp  },
  { name: 'Profilo', href: '/profile', icon: User },
];


export function Sidebar() {
  const { user, logout } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
     
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={toggleMobileMenu}
          className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 px-2 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

     
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      
      <div
        className={`
        h-screen bg-white/5 backdrop-blur-2xl border-r border-white/10 flex-shrink-0
        transition-all duration-300 ease-in-out overflow-x-hidden
        fixed top-0 left-0 z-40 lg:relative lg:z-auto
        transform ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        ${isCollapsed ? "w-20" : "w-64"}
      `}
      >
        <div className="flex flex-col h-full">
         
          <motion.div
            className="flex flex-col items-center px-4 py-4 flex-shrink-0"
            {...sidebarAnimations.sidebarHeader(isCollapsed)}
          >
            
            <motion.div
              className="flex items-center"
              {...sidebarAnimations.logoContainer(isCollapsed)}
            >
              <motion.div
                className={`w-10 h-10 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center ${
                  isCollapsed ? "" : "mr-3"
                }`}
                {...sidebarPresets.animatedLogo.icon}
              >
                <span className="text-white font-bold text-xl">F</span>
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="text-white font-bold text-lg tracking-tight"
                    {...sidebarAnimations.logoText}
                  >
                    FinanceFlow
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          
          <nav className="flex-1 px-4 pt-2 space-y-2 overflow-y-auto overflow-x-hidden relative">
            
            <div className="hidden lg:block">
              <motion.button
                onClick={toggleCollapse}
                className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-white/70 hover:text-white hover:bg-white/10 w-full `}
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
                      className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                      {...navigationAnimations.navTooltip}
                    >
                      {isCollapsed ? "Expand" : "Collapse"}
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.button>
            </div>

            {navigation.map((item, index) => {
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "text-white z-10"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    } `}
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
                          className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
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

          
          <motion.div
            className="p-6 border-t border-white/10 flex-shrink-0 mt-auto overflow-hidden"
            {...sidebarAnimations.userSection(isCollapsed)}
          >
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div key="expanded" {...userAnimations.userExpanded}>
                  <motion.div
                    className="flex items-center mb-6 min-w-0"
                    {...userAnimations.userInfo}
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                      {...userAnimations.userAvatar}
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium text-lg">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-white font-medium text-base truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-white/60 text-sm truncate">
                        {user?.email}
                      </p>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={handleLogout}
                    {...logoutAnimations.logoutExpanded}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  className="flex flex-col items-center space-y-4"
                  {...userAnimations.userCollapsed}
                >
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full flex items-center justify-center group relative"
                    {...userAnimations.userAvatar}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}

                    <motion.div {...userAnimations.userTooltip}>
                      {user?.name || "User"}
                    </motion.div>
                  </motion.div>

                  <motion.button
                    onClick={handleLogout}
                    title="Logout"
                    {...logoutAnimations.logoutCollapsed}
                  >
                    <LogOut className="h-5 w-5" />

                    <motion.div {...logoutAnimations.logoutTooltip}>
                      Logout
                    </motion.div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}