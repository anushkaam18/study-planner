import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, GraduationCap, LayoutGrid, Sparkles, Clock, Flame, BarChart2 } from "lucide-react";
import Sidebar from "../components/shared/Sidebar";
import InteractiveGlassCard from "../components/ui/InteractiveGlassCard";
import StreakWidget from "../components/dashboard/StreakWidget";
import FocusTimerWidget from "../components/dashboard/FocusTimerWidget";

/**
 * Premium SaaS-grade multi-panel Dashboard View.
 * Binds sidebar navigation systems, active color accent switchers,
 * interactive cursor-glowing draggable widgets, and secure Firestore
 * course controllers under a high-end multi-column grid layout.
 * 
 * @param {string} userEmail - Active user's email
 * @param {string} category - Chosen planning category (e.g., College 🎓)
 * @param {Array} subjects - Real-time synchronized database courses array
 * @param {function} onAddSubject - Database transaction callback creating courses
 * @param {function} onDeleteSubject - Database transaction callback deleting courses
 * @param {function} onBack - State callback backing step to category selection
 * @param {function} onLogout - Authentication callback performing sign-outs
 */
export default function DashboardView({
  userEmail,
  category,
  subjects,
  onAddSubject,
  onDeleteSubject,
  onBack,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newSubject, setNewSubject] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    setIsAdding(true);
    try {
      await onAddSubject(newSubject.trim());
      setNewSubject("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-6 gap-6 relative select-none">
      
      {/* ─── DESKTOP / MOBILE COLLAPSIBLE GLASS SIDEBAR ─── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={userEmail}
        onLogout={onLogout}
      />

      {/* ─── MAIN WORKSPACE PORTAL CONTAINER ─── */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-32px)] md:h-[calc(100vh-48px)] pt-14 md:pt-0">
        
        {/* Animated switch rendering based on Sidebar Active Tab */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: MASTER SAAS DASHBOARD PANEL */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1"
            >
              {/* Dynamic Welcome Heading */}
              <div className="text-left mb-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary flex items-center gap-1.5 mb-1.5">
                    <LayoutGrid className="w-3.5 h-3.5" /> Workspace Center
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                    Study Arena ({category})
                  </h2>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onBack}
                  className="px-4 py-2 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  Change Domain
                </motion.button>
              </div>

              {/* ─── RESPONSIVE WIDGET WORKSPACE GRID ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* COLUMN 1: Visual Metric Indicators (Streak & Pomodoro widgets) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <StreakWidget />
                  <FocusTimerWidget />
                </div>

                {/* COLUMN 2: Secured Interactive Course Console Widget */}
                <div className="lg:col-span-7 h-full">
                  <InteractiveGlassCard className="flex flex-col h-full gap-5">
                    
                    {/* Console Header */}
                    <div className="flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1.5 mb-1">
                          <BookOpen className="w-3.5 h-3.5" /> Course Manager
                        </span>
                        <h3 className="text-lg font-bold text-white leading-tight">Current Syllabi</h3>
                      </div>

                      {/* Course count badge */}
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-zinc-900/60 border border-white/5 text-zinc-400">
                        {subjects.length} Topics
                      </span>
                    </div>

                    {/* Quick Add subject bar form inside widget */}
                    <form onSubmit={handleAddSubmit} className="flex gap-2.5 w-full">
                      <div className="relative flex-1">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="e.g., Organic Chemistry, Linear Algebra"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          disabled={isAdding}
                          className="glass-input pl-11 py-2.5 w-full text-xs"
                          required
                        />
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isAdding || !newSubject.trim()}
                        className="premium-btn px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 font-medium shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isAdding ? (
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Add
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Interactive Subjects Stack */}
                    <div className="flex flex-col gap-2 min-h-[220px] overflow-y-auto max-h-[360px] pr-1">
                      <AnimatePresence mode="popLayout">
                        {subjects.length === 0 ? (
                          /* Illustrated empty state */
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-white/[0.01] flex-1"
                          >
                            <BookOpen className="w-8 h-8 text-zinc-600 mb-3 animate-pulse" />
                            <h4 className="text-xs font-semibold text-zinc-300 mb-1">No courses created yet</h4>
                            <p className="text-[10px] text-zinc-500 max-w-[220px] leading-relaxed">
                              Syllabus planning is empty. Start adding topics above to schedule study blocks!
                            </p>
                          </motion.div>
                        ) : (
                          /* Dynamic spring list stack */
                          <div className="flex flex-col gap-2">
                            {subjects.map((subj) => (
                              <motion.div
                                key={subj.id}
                                layout
                                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 10, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                                className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] px-3.5 py-3 rounded-xl flex items-center justify-between transition-all duration-300 group shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-xs font-semibold text-zinc-200">
                                    {subj.name}
                                  </span>
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => onDeleteSubject(subj.id)}
                                  className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 bg-transparent hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                                  aria-label={`Delete ${subj.name}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                  </InteractiveGlassCard>
                </div>

              </div>
            </motion.div>
          )}

          {/* TEASER TABS: Coming Soon Panels */}
          {["focus", "streaks", "analytics"].includes(activeTab) && (
            <motion.div
              key="teaser-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex items-center justify-center p-4"
            >
              <InteractiveGlassCard className="w-full max-w-[480px] p-10 flex flex-col items-center text-center">
                <motion.div
                  animate={{
                    rotate: [0, 8, -8, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/30 to-accent/30 border border-primary/20 flex items-center justify-center text-primary shadow-xl mb-6 relative"
                >
                  {activeTab === "focus" && <Clock className="w-7 h-7" />}
                  {activeTab === "streaks" && <Flame className="w-7 h-7" />}
                  {activeTab === "analytics" && <BarChart2 className="w-7 h-7" />}
                  <span className="absolute -inset-1 rounded-2xl bg-primary/10 blur-md animate-pulse" />
                </motion.div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center gap-1.5 mb-2 animate-bounce">
                  <Sparkles className="w-3 h-3" /> Coming Up Next
                </span>

                <h2 className="text-2xl font-bold text-white mb-3">
                  {activeTab === "focus" && "Immersive Focus Canvas"}
                  {activeTab === "streaks" && "Streak Rewards & XP Store"}
                  {activeTab === "analytics" && "Deep Work AI Analytics"}
                </h2>

                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-6">
                  {activeTab === "focus" && "A minimal full-screen focus workspace utilizing integrated white noise audio layers, spatial rain, and ambient light togglers designed to double focus capacities."}
                  {activeTab === "streaks" && "Consecutive focus day tracks backed by streak shield protection shields, levels XP progression badges, and gamified customizable color reward elements."}
                  {activeTab === "analytics" && "Intelligent burnout alerts and mood-focused deep work tracking metrics compiled daily by advanced local AI categorization algorithms."}
                </p>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("dashboard")}
                  className="premium-btn px-6 py-3 text-xs flex items-center gap-2 cursor-pointer"
                >
                  Return to Dashboard
                </motion.button>
              </InteractiveGlassCard>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
