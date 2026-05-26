import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import { useThemeAccent } from "../../hooks/useThemeAccent";

/**
 * Premium tactile Glass Card container.
 * Features:
 * 1. Hardware-accelerated cursor tracking: Glows dynamically under the pointer at 120 FPS.
 * 2. Draggable physics: Responsive spring-based drag and elastic snapback constraints.
 * 
 * @param {ReactNode} children - Contents to display inside the card
 * @param {string} className - Additional CSS class utilities
 * @param {boolean} draggable - Toggle if this card allows physics dragging
 */
export default function InteractiveGlassCard({ children, className = "", draggable = true }) {
  const { activeAccent } = useThemeAccent();
  
  // Hardware-accelerated cursor mapping: Zero state re-renders on mousemove!
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    // Calculate relative coordinates
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // High-performance CSS background glow spotlight string template
  const background = useMotionTemplate`
    radial-gradient(
      280px circle at ${mouseX}px ${mouseY}px,
      ${activeAccent.glowHex}18,
      transparent 80%
    )
  `;

  const border = useMotionTemplate`
    radial-gradient(
      180px circle at ${mouseX}px ${mouseY}px,
      ${activeAccent.glowHex}45,
      transparent 80%
    )
  `;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      // Drag physical interactions
      drag={draggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Auto snapback behavior!
      dragElastic={0.06} // Soft bouncy pull resistance
      dragTransition={{ bounceStiffness: 450, bounceDamping: 24 }} // Spring return physics
      whileHover={draggable ? { scale: 1.01, y: -2 } : {}}
      whileDrag={{ scale: 1.03, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`glass-panel rounded-3xl p-6 relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        touchAction: "none" // Crucial for responsive mobile drag behaviors
      }}
    >
      {/* 1. Cursor Hover Radial Spotlight Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 z-0"
        style={{ background }}
      />

      {/* 2. Interactive Spotlight Border Outline Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 z-0 rounded-3xl border border-transparent"
        style={{
          borderColor: "transparent",
          backgroundImage: border,
          maskImage: "linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)",
          maskComposite: "exclude",
          WebkitMaskImage: "linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)",
          WebkitMaskComposite: "destination-out",
        }}
      />

      {/* Content wrapper with z-index to stay above spotlight glow overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
