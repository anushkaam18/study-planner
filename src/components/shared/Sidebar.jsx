import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeAccent } from "../../hooks/useThemeAccent";
import {
  LayoutGrid,
  BookOpen,
  Flame,
  Clock,
  BarChart2,
  LogOut,
  Palette,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

/**
 * Premium collapsible glass sidebar workspace layout.
 * Combines full desktop grid navigation panels with dynamic layout indicators,
 * responsive mobile drawers, and a built-in color-theme accent customization dashboard.
 * 
 * @param {string} activeTab - Active navigation identifier
 * @param {function} setActiveTab - Navigation setter callback
 * @param {string} userEmail - Authenticated user email
 * @param {function} onLogout - Firebase authentication sign-out pipeline
 */
export default function Sidebar({ activeTab, setActiveTab, userEmail, onLogout }) {
  const { activeAccent, setAccent, allAccents } = useThemeAccent();
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer toggle state

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "focus", label: "Focus Canvas", icon: Clock, premium: true },
    { id: "streaks", label: "Streaks", icon: Flame, premium: true },
    { id: "analytics", label: "Analytics", icon: BarChart2, premium: true },
  ];

  const userLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Common navigation listing renderer
  const renderNavList = () => (
    <nav className="flex flex-col gap-1.5 w-full flex-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false); // Close mobile drawer
            }}
            className={`relative flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 select-none group cursor-pointer focus:outline-none ${
              isActive
                ? "text-white"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {/* Slide active backing capsule */}
            {isActive && (
              <motion.div
                layoutId="activeSidebarBacking"
                className="absolute inset-0 rounded-2xl bg-white/[0.04] border border-white/5 pointer-events-none"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <div className="flex items-center gap-3 relative z-10">
              <Icon
                className={`w-5 h-5 transition-colors group-hover:scale-105 duration-300 ${
                  isActive ? activeAccent.primaryClass : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              />
              <span>{item.label}</span>
            </div>

            {item.premium && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90 relative z-10 flex items-center gap-0.5 ${
                isActive 
                  ? `${activeAccent.bgMuted} ${activeAccent.primaryClass} border border-primary/20` 
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700"
              }`}>
                <Sparkles className="w-2.5 h-2.5" /> Next
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ─── MOBILE HEADER & HAMBURGER TRIGGER ─── */}
      <div className="md:hidden fixed top-4 left-4 z-40 flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-3 rounded-2xl glass-panel text-white hover:text-primary transition-all duration-300 shadow-xl cursor-pointer"
          aria-label="Toggle side navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ─── MOBILE SLIDE-OUT OVERLAY DRAWER ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Semi-transparent backdrop blur wrapper */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar drawer frame */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[270px] z-30 flex flex-col p-6 glass-panel border-r border-white/5 shadow-2xl justify-between"
            >
              {/* Sidebar top Brand logo */}
              <div className="flex items-center gap-3 mb-8 pt-12">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-lg font-bold text-white leading-none">SP Core</h1>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Workspace v1</span>
                </div>
              </div>

              {/* Navigation Items */}
              {renderNavList()}

              {/* Theme customizer & profile footer */}
              {renderFooterContent(userLetter, userEmail, allAccents, activeAccent, setAccent, onLogout)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── DESKTOP FIXED GLASS SIDEBAR ─── */}
      <aside className="hidden md:flex flex-col w-[260px] h-[calc(100vh-48px)] p-6 glass-panel rounded-3xl border border-white/5 shadow-2xl justify-between shrink-0 select-none">
        
        {/* Brand logo Area */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-semibold text-white leading-none">Study Planner</h1>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Workspace v1.2</span>
          </div>
        </div>

        {/* Navigation list panel */}
        {renderNavList()}

        {/* Dynamic theme selector + User Profile panel */}
        {renderFooterContent(userLetter, userEmail, allAccents, activeAccent, setAccent, onLogout)}

      </aside>
    </>
  );
}

// Extracted footer block to ensure consistent rendering between layouts
function renderFooterContent(userLetter, userEmail, allAccents, activeAccent, setAccent, onLogout) {
  return (
    <div className="flex flex-col gap-6 border-t border-white/5 pt-6 mt-6">
      
      {/* 🔮 THEME DYNAMIC SWAP ACCENT LIST */}
      <div className="flex flex-col gap-2.5 text-left pl-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" /> Workspace Glow
        </span>
        <div className="flex items-center gap-2.5 mt-1">
          {allAccents.map((acc) => {
            const isSelected = activeAccent.id === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => setAccent(acc.id)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center relative cursor-pointer group focus:outline-none transition-all duration-300`}
                style={{
                  backgroundColor: acc.glowHex,
                  borderColor: isSelected ? "white" : "rgba(255,255,255,0.1)",
                  boxShadow: isSelected ? `0 0 12px ${acc.glowHex}80` : "none",
                }}
                aria-label={`Switch theme color to ${acc.name}`}
              >
                {/* Bubble pulse indicator on hover */}
                <span className="absolute -inset-1 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 👤 USER ACCOUNT INFO & SIGN OUT BUTTON */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-2 bg-white/[0.01] border border-white/5 rounded-2xl text-left">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-white">
            {userLetter}
          </div>
          <div className="flex flex-col overflow-hidden max-w-[140px]">
            <span className="text-xs font-semibold text-white leading-none mb-1">Authenticated</span>
            <span className="text-[10px] text-zinc-500 truncate leading-none">{userEmail || "anonymous@domain.com"}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-transparent hover:border-red-500/10 text-zinc-500 hover:text-red-400 text-xs font-medium bg-transparent hover:bg-red-500/5 transition-all cursor-pointer focus:outline-none"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

    </div>
  );
}
