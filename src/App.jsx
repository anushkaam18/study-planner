import { useEffect, useState } from "react";
import { auth, db } from "./firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [darkMode, setDarkMode] = useState(true);

  // 🔐 Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        loadSubjects(currentUser.email);
      } else {
        setSubjects([]);
      }
    });

    return () => unsub();
  }, []);

  // 📥 Load subjects
  const loadSubjects = async (email) => {
    const data = await getDocs(collection(db, "subjects"));

    const filtered = data.docs
      .filter((d) => d.data().user === email)
      .map((d) => ({
        id: d.id,
        name: d.data().name
      }));

    setSubjects(filtered);
  };

  // ➕ Add subject
  const addSubject = async () => {
    if (!subject.trim()) return;

    await addDoc(collection(db, "subjects"), {
      name: subject,
      user: user.email
    });

    setSubject("");
    loadSubjects(user.email);
  };

  // 🗑️ Delete subject
  const deleteSubject = async (id) => {
    await deleteDoc(doc(db, "subjects", id));
    loadSubjects(user.email);
  };

  // 🔐 Login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.log(e.message);
    }
  };

  // 🆕 Signup
  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.log(e.message);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div style={styles.container(darkMode)}>

      {/* 🌙 Toggle */}
      <button style={styles.toggle} onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <h1 style={{ marginBottom: "20px" }}>Study Planner</h1>

      {!user ? (
        // 🔐 LOGIN UI
        <div style={styles.card(darkMode)}>

          <h2>Welcome Back 👋</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input(darkMode)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input(darkMode)}
          />

          <button style={styles.btn} onClick={login}>
            Login
          </button>

          <button style={styles.btnGreen} onClick={signup}>
            Sign Up
          </button>

        </div>
      ) : (
        // 📊 DASHBOARD
        <div style={styles.card(darkMode)}>

          <h2>Hello 👋</h2>
          <p>{user.email}</p>

          <div style={{ marginTop: "15px" }}>
            <input
              placeholder="Add subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input(darkMode)}
            />

            <button style={styles.btn} onClick={addSubject}>
              ➕ Add Subject
            </button>
          </div>

          {/* 🧾 CARDS */}
          <div style={styles.grid}>
            {subjects.map((sub) => (
              <div
                key={sub.id}
                style={styles.cardItem}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h3 style={{ margin: 0 }}>{sub.name}</h3>

                <button
                  style={styles.delete}
                  onClick={() => deleteSubject(sub.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button style={styles.logout} onClick={logout}>
            Logout
          </button>

        </div>
      )}
    </div>
  );
}

export default App;

// 🎨 PRO STYLES
const styles = {
  container: (dark) => ({
    minHeight: "100vh",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    background: dark
      ? "linear-gradient(135deg,#0f172a,#111827)"
      : "linear-gradient(135deg,#eef2ff,#f5f3ff)",
    color: dark ? "#fff" : "#111"
  }),

  card: (dark) => ({
    width: "380px",
    margin: "auto",
    padding: "25px",
    borderRadius: "24px",
    background: dark
      ? "rgba(255,255,255,0.05)"
      : "rgba(255,255,255,0.75)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
  }),

  input: (dark) => ({
    width: "92%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "14px",
    border: "none",
    outline: "none",
    background: dark ? "#1f2937" : "#fff",
    color: dark ? "#fff" : "#111"
  }),

  btn: {
    width: "95%",
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#3b82f6)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px"
  },

  btnGreen: {
    width: "95%",
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px"
  },

  logout: {
    marginTop: "15px",
    width: "95%",
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontWeight: "600"
  },

  toggle: {
    marginBottom: "15px",
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer"
  },

  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
    gap: "12px"
  },

  cardItem: {
    padding: "12px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: "0.3s",
    cursor: "pointer"
  },

  delete: {
    marginTop: "8px",
    padding: "5px 10px",
    borderRadius: "8px",
    border: "none",
    background: "#ff4d4d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px"
  }
};