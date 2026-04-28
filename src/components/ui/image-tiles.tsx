import { motion, type Variants } from "framer-motion";

interface ImageRevealProps {
  leftImage: string;
  middleImage: string;
  rightImage: string;
}

export default function ImageReveal({
  leftImage,
  middleImage,
  rightImage,
}: ImageRevealProps) {
  const containerVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

  const leftImageVariants: Variants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: -8,
      x: -150,
      y: 10,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 1,
      x: -160,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const middleImageVariants: Variants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: 6,
      x: 0,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 0,
      x: 0,
      y: -10,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const rightImageVariants: Variants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: -6,
      x: 200,
      y: 20,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 3,
      x: 200,
      y: 10,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="relative my-12 flex h-64 w-64 items-center justify-center"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="absolute h-48 w-48 origin-bottom-right overflow-hidden rounded-xl shadow-lg"
        variants={leftImageVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 30 }}
      >
        <img
          src={leftImage}
          alt="Left image"
          className="h-full w-full rounded-xl object-cover"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="absolute h-48 w-48 origin-bottom-left overflow-hidden rounded-xl shadow-lg"
        variants={middleImageVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 20 }}
      >
        <img
          src={middleImage}
          alt="Middle image"
          className="h-full w-full rounded-2xl object-cover"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="absolute h-48 w-48 origin-bottom-right overflow-hidden rounded-xl shadow-lg"
        variants={rightImageVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 10 }}
      >
        <img
          src={rightImage}
          alt="Right image"
          className="h-full w-full rounded-2xl object-cover"
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
}

