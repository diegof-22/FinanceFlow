import { Transition } from 'framer-motion';
const transitions = {
  quick: {
    duration: 0.2
  } as Transition,

  smooth: {
    duration: 0.3
  } as Transition,
};


export const buttonAnimations = {
  primary: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: transitions.quick,
    className: "transition-all duration-200"
  },

  secondary: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: transitions.quick,
    className: "transition-all duration-200"
  },

  ghost: {
    whileHover: { scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" },
    whileTap: { scale: 0.95 },
    transition: transitions.quick
  },

  destructive: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: transitions.quick,
    className: "transition-all duration-200 hover:bg-red-500/20"
  }
};


export const formAnimations = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: transitions.smooth
  },

  field: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: transitions.smooth
  },

  submit: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: transitions.quick
  }
};