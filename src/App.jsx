import { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { subscribeToSubjects, addSubject, deleteSubject } from "./services/subjectsService";
import LoginView from "./views/LoginView";
import CategoryView from "./views/CategoryView";
import DashboardView from "./views/DashboardView";
import Toast from "./components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Main Application Orchestrator.
 * Binds clean business logic, Firebase authentication events,
 * and optimized real-time database queries to state-driven view routers.
 * Encapsulated inside a high-end CSS radial-gradient mesh wrapper.
 */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // App routing steps: "login" | "category" | "subjects"
  const [step, setStep] = useState("login");
  const [category, setCategory] = useState("");
  const [subjects, setSubjects] = useState([]);

  // Toast message management
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  // 🔐 1. AUTH STATE OBSERVER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Safe check: Keep active category if already set, else guide to selection
        setStep((prev) => (prev === "subjects" && category ? "subjects" : "category"));
      } else {
        setStep("login");
        setCategory("");
        setSubjects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  // 📥 2. SECURE REAL-TIME DATA SYNCING
  useEffect(() => {
    // Only subscribe when authenticated, inside subjects step, and category is active
    if (!user || step !== "subjects" || !category) return;

    // Sets up a real-time reactive sync to database-level query constraints
    const unsubscribe = subscribeToSubjects(user.email, (data) => {
      // Sort subjects by newest creation first, keeping list visually organized
      const sorted = [...data].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
      setSubjects(sorted);
    });

    // Cleanup: Avoid memory leaks when component unmounts or steps change!
    return () => unsubscribe();
  }, [user, step, category]);

  // 🔐 3. FIREBASE AUTH ACTIONS
  const handleLogin = async (email, password) => {
    setIsAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Welcome back! Loading focus dashboard...", "success");
    } catch (e) {
      showToast(e.message.replace("Firebase: ", ""), "error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignup = async (email, password) => {
    setIsAuthenticating(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast("Account established successfully!", "success");
    } catch (e) {
      showToast(e.message.replace("Firebase: ", ""), "error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Signed out securely.", "success");
    } catch (e) {
      showToast("Failed to sign out.", "error");
    }
  };

  // ➕ 4. SECURE SUBJECT ACTIONS
  const handleAddSubject = async (subjectName) => {
    if (!user) return;
    try {
      await addSubject(subjectName, category, user.email);
    } catch (e) {
      showToast("Failed to write to database. Check connection.", "error");
      throw e;
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteSubject(id);
    } catch (e) {
      showToast("Failed to remove course.", "error");
    }
  };

  // ─── LOADING SCREEN OVERLAY ───
  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col items-center justify-center gap-4 text-zinc-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary"
        />
        <span className="text-sm font-medium tracking-wide">Syncing Session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden font-sans antialiased text-zinc-100 selection:bg-primary/30 selection:text-white">
      
      {/* ─── TOAST BANNER NOTIFICATION ─── */}
      <AnimatePresence>
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </AnimatePresence>

      {/* ─── VIEW ANIMATED TRANSITIONS ─── */}
      <AnimatePresence mode="wait">
        {step === "login" && (
          <motion.div
            key="login-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <LoginView
              onLogin={handleLogin}
              onSignup={handleSignup}
              isAuthenticating={isAuthenticating}
            />
          </motion.div>
        )}

        {step === "category" && (
          <motion.div
            key="category-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CategoryView
              selectedCategory={category}
              onSelectCategory={setCategory}
              onContinue={() => setStep("subjects")}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {step === "subjects" && (
          <motion.div
            key="subjects-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardView
              userEmail={user?.email}
              category={category}
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
              onBack={() => setStep("category")}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;