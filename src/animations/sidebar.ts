import { Transition } from 'framer-motion';


const transitions = {
  spring: {
    type: "spring",
    stiffness: 500,
    damping: 30
  } as Transition,

  softSpring: {
    type: "spring",
    stiffness: 400,
    damping: 25
  } as Transition,

  quick: {
    duration: 0.2
  } as Transition,

  smooth: {
    duration: 0.3
  } as Transition,
};


const scaleAnimations = {
  interactiveScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: transitions.softSpring
  },

  tapScale: {
    whileTap: { scale: 0.95 },
    transition: transitions.quick
  }
};


export const sidebarAnimations = {

  sidebarHeader: (isCollapsed: boolean) => ({
    animate: {},
    transition: transitions.smooth
  }),

  logoContainer: (isCollapsed: boolean) => ({
    animate: {},
    transition: transitions.smooth
  }),

  logoText: {
    initial: { opacity: 0, width: 0 },
    animate: { opacity: 1, width: "auto" },
    exit: { opacity: 0, width: 0 },
    transition: transitions.smooth
  },

  userSection: (isCollapsed: boolean) => ({
    animate: {
      padding: isCollapsed ? '1.5rem 1rem' : '1.5rem',
    },
    transition: transitions.smooth
  })
};


export const navigationAnimations = {
  activeIndicator: {
    layoutId: "activeTab",
    initial: false,
    transition: transitions.spring,
    className: "absolute inset-0 bg-blue-600/20 border border-blue-500/30 rounded-xl"
  },

  navItem: (isActive: boolean) => ({
    animate: {
      scale: isActive ? 1.05 : 1,
    },
    transition: transitions.softSpring
  }),

  navItemText: (isActive: boolean) => ({
    animate: {
      opacity: isActive ? 1 : 0.7,
    },
    transition: transitions.quick
  }),

  navTooltip: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 0, x: 0 },
    whileHover: { opacity: 1 },
    exit: { opacity: 0, x: -10 },
    transition: transitions.quick
  }
};


export const toggleAnimations = {
  toggleButton: {
    transition: transitions.quick
  },

  toggleIcon: (isCollapsed: boolean) => ({
    animate: { scale: 1 },
    whileHover: { scale: 1.05 },
    transition: transitions.smooth
  })
};


export const userAnimations = {
  userExpanded: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.quick
  },

  userCollapsed: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.quick
  },

  userAvatar: {
    ...scaleAnimations.interactiveScale
  },

  userInfo: {
    whileHover: { scale: 1.02 },
    transition: transitions.quick
  },

  userTooltip: {
    initial: { opacity: 0, x: -10 },
    whileHover: { opacity: 1, x: 0 },
    transition: transitions.quick,
    className: "absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
  }
};


export const logoutAnimations = {
  logoutExpanded: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: transitions.quick,
    className: "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200"
  },

  logoutCollapsed: {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
    transition: transitions.quick,
    className: "flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200"
  },

  logoutTooltip: {
    initial: { opacity: 0, x: -10 },
    whileHover: { opacity: 1, x: 0 },
    transition: transitions.quick,
    className: "absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
  }
};


export const sidebarPresets = {
  animatedLogo: {
    container: sidebarAnimations.logoContainer,
    icon: {
      ...scaleAnimations.interactiveScale
    },
    text: sidebarAnimations.logoText
  }
};