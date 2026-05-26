import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Play, Pause, Music, Volume2, Sparkles } from "lucide-react";
import InteractiveGlassCard from "../ui/InteractiveGlassCard";

const MUSIC_CHANNELS = [
  { id: "lofi", label: "Lofi Beats" },
  { id: "rain", label: "Rain Forest" },
  { id: "space", label: "Deep Space" },
];

/**
 * Premium Deep Work Teaser Timer Widget.
 * Formatted inside an InteractiveGlassCard, containing circular ring timers,
 * lofi/rain sound channels, spring-loaded buttons, and particle ambient selectors.
 */
export default function FocusTimerWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState("lofi");

  return (
    <InteractiveGlassCard className="flex flex-col h-full justify-between">
      
      {/* Widget Header area */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5" /> Deep Work
          </span>
          <h3 className="text-lg font-bold text-white leading-tight">Focus Canvas</h3>
        </div>

        {/* Floating XP badge */}
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> +25 XP
        </span>
      </div>

      {/* ─── DUAL TIMED DIAL CANVAS ─── */}
      <div className="flex items-center gap-6 my-2">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          
          {/* Background glowing circle ring */}
          <svg className="absolute w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              className="stroke-white/[0.03] fill-none"
              strokeWidth="6"
            />
            {/* Active glowing accent sweep arc */}
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              className="stroke-primary fill-none"
              strokeWidth="6"
              strokeDasharray="251.2"
              // Smooth mock progress value
              animate={{ strokeDashoffset: isPlaying ? 160 : 70 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 0 4px var(--color-primary))",
              }}
            />
          </svg>

          {/* Central timer numeric output */}
          <div className="flex flex-col items-center justify-center relative">
            <span className="text-xl font-bold tracking-tight text-white leading-none">25:00</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 mt-1">Pomodoro</span>
          </div>
        </div>

        {/* Play/Pause control suite */}
        <div className="flex flex-col gap-2.5 w-full">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all duration-300 ${
              isPlaying
                ? "bg-white/[0.04] border border-white/10 text-white"
                : "premium-btn"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white text-white" /> Pause Session
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white text-white" /> Start Timer
              </>
            )}
          </motion.button>

          {/* Cancel session tracker */}
          {isPlaying && (
            <motion.button
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => setIsPlaying(false)}
              className="text-[10px] text-zinc-500 hover:text-red-400 font-semibold cursor-pointer underline transition-all"
            >
              Discard Session
            </motion.button>
          )}
        </div>
      </div>

      {/* ─── AMBIENT AUDIO PANEL CHANNELS ─── */}
      <div className="flex flex-col gap-2 border-t border-white/5 pt-4 mt-2">
        <div className="flex items-center justify-between text-left">
          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-1.5">
            <Music className="w-3 h-3 text-zinc-400" /> Focus Soundscape
          </span>
          {isPlaying && (
            <Volume2 className="w-3 h-3 text-primary animate-pulse" />
          )}
        </div>

        {/* Horizontal music channel selectors */}
        <div className="grid grid-cols-3 gap-1.5 mt-1">
          {MUSIC_CHANNELS.map((ch) => {
            const isSel = sound === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSound(ch.id)}
                className={`text-[9px] font-semibold py-1.5 px-1 rounded-lg border transition-all duration-300 cursor-pointer focus:outline-none ${
                  isSel
                    ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_8px_rgba(108,99,255,0.15)]"
                    : "bg-white/[0.01] border-white/5 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {ch.label}
              </button>
            );
          })}
        </div>
      </div>

    </InteractiveGlassCard>
  );
}
