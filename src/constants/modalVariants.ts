import type { Variants } from "framer-motion";
const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 40,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 40,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export default modalVariants;
