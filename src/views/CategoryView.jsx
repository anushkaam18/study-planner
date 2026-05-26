import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, FileText, Briefcase, LogOut, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "School 📘",
    label: "School",
    icon: BookOpen,
    desc: "Grade school and foundational syllabus",
    color: "from-blue-500/20 to-cyan-500/10 hover:border-blue-500/30",
    glowColor: "bg-blue-500/10",
    textColor: "text-blue-400",
  },
  {
    id: "College 🎓",
    label: "College",
    icon: GraduationCap,
    desc: "Universities, degrees, and core modules",
    color: "from-purple-500/20 to-pink-500/10 hover:border-purple-500/30",
    glowColor: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
  {
    id: "Exams 📝",
    label: "Exams",
    icon: FileText,
    desc: "Standardized tests, SATs, and entrances",
    color: "from-amber-500/20 to-orange-500/10 hover:border-amber-500/30",
    glowColor: "bg-amber-500/10",
    textColor: "text-amber-400",
  },
  {
    id: "Placement 💼",
    label: "Placement",
    icon: Briefcase,
    desc: "Coding rounds, interviews, and jobs",
    color: "from-emerald-500/20 to-teal-500/10 hover:border-emerald-500/30",
    glowColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
  },
];

/**
 * Modern tactile Category Grid Selector.
 * Replaces generic HTML form selection lists with responsive, spring-loaded
 * interactive cards that respond instantly to touch or click.
 * 
 * @param {string} selectedCategory - Active chosen category string
 * @param {function} onSelectCategory - State trigger updates choice
 * @param {function} onContinue - Advances wizard step to dashboard view
 * @param {function} onLogout - Firebase authentication sign-out pipeline
 */
export default function CategoryView({ selectedCategory, onSelectCategory, onContinue, onLogout }) {
  const [activeSelect, setActiveSelect] = useState(selectedCategory || "");

  const handleCardClick = (id) => {
    setActiveSelect(id);
    onSelectCategory(id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="glass-panel w-full max-w-[680px] rounded-3xl p-8 flex flex-col items-center relative overflow-hidden"
      >
        {/* Soft Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
            Select Your Target Category
          </h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Choose your planning domain to personalize your adaptive schedule templates and task algorithms.
          </p>
        </div>

        {/* 2x2 Grid of Tactile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8 relative">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = activeSelect === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 200, damping: 18 }}
                onClick={() => handleCardClick(cat.id)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 backdrop-blur-sm select-none ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_25px_rgba(108,99,255,0.2)]"
                    : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-zinc-300 hover:text-white"
                } ${cat.color}`}
              >
                {/* Active check border glow indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryBorder"
                    className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}

                {/* Left vertical border highlight on select */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${cat.glowColor}`}>
                  <Icon className={`w-5 h-5 ${cat.textColor}`} />
                </div>

                <h3 className="text-lg font-medium text-white mb-1">{cat.label}</h3>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">{cat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between w-full border-t border-white/5 pt-6 z-10">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (!activeSelect) return;
              onContinue();
            }}
            disabled={!activeSelect}
            className="premium-btn px-6 py-3 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
