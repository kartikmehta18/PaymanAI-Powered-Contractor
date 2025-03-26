
export const transitions = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.3 }
  },
  stagger: (delay = 0.05) => ({
    transition: { staggerChildren: delay }
  }),
  delayChildren: (delay = 0.1) => ({
    transition: { delayChildren: delay }
  })
};

export const scrollReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const blurIn = {
  initial: { 
    opacity: 0,
    filter: "blur(8px)"
  },
  animate: { 
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const createAnimationSequence = (baseDelay = 0) => {
  let currentDelay = baseDelay;
  
  return {
    next: (duration = 0.3) => {
      const delay = currentDelay;
      currentDelay += duration;
      return {
        transition: {
          delay,
          duration
        }
      };
    },
    reset: (newBaseDelay = 0) => {
      currentDelay = newBaseDelay;
    }
  };
};
