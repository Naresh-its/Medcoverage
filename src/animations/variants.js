// MedCoverage Clinical Motion System
// Clean, clinical, restrained Apple-level micro-interactions

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.45, 
      ease: [0.16, 1, 0.3, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { 
      duration: 0.25, 
      ease: "easeIn" 
    }
  }
};

export const staggerContainer = (staggerTime = 0.08, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
      delayChildren
    }
  }
});

export const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const hospitalCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const buttonPress = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15, ease: "easeOut" }
};

export const cardHover = {
  whileHover: { 
    y: -3, 
    scale: 1.008,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.25 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const scrollReveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  },
  viewport: { once: true, amount: 0.15 }
};
