import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import InteractiveGlassCard from "../ui/InteractiveGlassCard";

const WEEKDAYS = [
  { label: "M", completed: true, active: false },
  { label: "T", completed: true, active: false },
  { label: "W", completed: true, active: false },
  { label: "T", completed: true, active: true }, // Current active day
  { label: "F", completed: false, active: false },
  { label: "S", completed: false, active: false },
  { label: "S", completed: false, active: false },
];

/**
 * Premium habit-tracking Streak Widget.
 * Formatted inside an InteractiveGlassCard, utilizing pulsing halo animations,
 * tactile day bubbles, and gamified progress indicators.
 */
export default function StreakWidget() {
  return (
    <InteractiveGlassCard className="flex flex-col h-full justify-between">
      
      {/* Widget Header Area */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400 flex items-center gap-1.5 mb-1 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> Active Burn
          </span>
          <h3 className="text-lg font-bold text-white leading-tight">Focus Streak</h3>
        </div>

        {/* Dynamic Streak Badge bubble */}
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-lg relative group">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" style={{ animationDuration: "2.5s" }} />
          {/* Flame Ambient Halo glow backdrop */}
          <span className="absolute -inset-1.5 rounded-2xl bg-orange-500/10 blur-md pointer-events-none animate-pulse-slow" />
        </div>
      </div>

      {/* Gamified Text Metrics */}
      <div className="text-left my-4 relative">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-extrabold text-white tracking-tight">4</span>
          <span className="text-sm font-semibold text-zinc-400">consecutive days</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-[240px]">
          Amazing consistency! You are in the top 8% of students this week. Keep burning!
        </p>
      </div>

      {/* ─── WEEKLY PROGRESS CARD MATRIX ─── */}
      <div className="grid grid-cols-7 gap-2.5 my-3">
        {WEEKDAYS.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            {/* Tactile Day bubble */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold border transition-all duration-300 relative ${
                day.completed
                  ? "bg-gradient-to-tr from-orange-500 to-amber-500 border-transparent text-white shadow-md shadow-orange-500/20"
                  : day.active
                  ? "bg-white/[0.02] border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)] animate-pulse"
                  : "bg-white/[0.01] border-white/5 text-zinc-600"
              }`}
            >
              {day.label}
              
              {/* Flame spark cursor particles on current active day bubble */}
              {day.active && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Gamified trophy goal line */}
      <div className="flex items-center gap-2.5 border-t border-white/5 pt-4 mt-2 text-left">
        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-[10px] font-medium text-zinc-500">
          Next Reward milestone: <strong className="text-zinc-300">5 Days</strong> (100 Focus XP)
        </span>
      </div>

    </InteractiveGlassCard>
  );
}
