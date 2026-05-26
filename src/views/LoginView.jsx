import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Mail, Sparkles, BookOpen } from "lucide-react";

/**
 * Premium glassmorphic Login and Registration View.
 * Employs clean state-driven mode toggling, spring micro-interactions,
 * and high-end aesthetics inspired by modern SaaS entry portals.
 * 
 * @param {function} onLogin - Handles user login payload (email, password)
 * @param {function} onSignup - Handles user registration payload (email, password)
 * @param {boolean} isAuthenticating - Trigger state to render loading spinners
 */
export default function LoginView({ onLogin, onSignup, isAuthenticating }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!email.trim() || !password.trim()) {
      setValidationError("Please fill out all credentials.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (isLoginMode) {
      onLogin(email, password);
    } else {
      onSignup(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="glass-panel w-full max-w-[420px] rounded-3xl p-8 flex flex-col relative overflow-hidden"
      >
        {/* Glow Accent Sphere */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8 relative">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 mb-4"
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            Study Planner
          </h1>
          <p className="text-sm text-zinc-400">
            {isLoginMode ? "Enter credentials to resume deep work" : "Create an account to start your productivity journey"}
          </p>
        </div>

        {/* Input Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAuthenticating}
                className="glass-input pl-11 w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pl-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticating}
                className="glass-input pl-11 w-full"
                required
              />
            </div>
          </div>

          {/* Validation Alert */}
          <AnimatePresence>
            {(validationError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs font-medium text-red-400 text-center pl-1"
              >
                ⚠️ {validationError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger Buttons */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isAuthenticating}
            className="premium-btn w-full py-3.5 mt-2 flex items-center justify-center gap-2 cursor-pointer font-medium disabled:opacity-50"
          >
            {isAuthenticating ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : isLoginMode ? (
              <>
                🔐 Let's Focus
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Start Productivity
              </>
            )}
          </motion.button>
        </form>

        {/* Mode Toggle footer */}
        <div className="text-center mt-6 text-sm text-zinc-400 z-10">
          {isLoginMode ? "First time planning?" : "Already structured?"}{" "}
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setValidationError("");
            }}
            disabled={isAuthenticating}
            className="text-primary hover:text-primary-hover font-medium underline transition-colors cursor-pointer pl-1"
          >
            {isLoginMode ? "Sign up here" : "Log in here"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
