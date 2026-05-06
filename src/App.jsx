import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("login"); 
  // login → category → subjects

  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

  const subjectsCollection = collection(db, "subjects");

  // AUTH LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) setStep("category");
    });

    return () => unsub();
  }, []);

  // LOAD SUBJECTS
  const loadSubjects = async () => {
    if (!user) return;

    const data = await getDocs(subjectsCollection);

    const filtered = data.docs
      .map((d) => ({ ...d.data(), id: d.id }))
      .filter((s) => s.user === user.email);

    setSubjects(filtered);
  };

  useEffect(() => {
    if (step === "subjects") loadSubjects();
  }, [step]);

  // LOGIN
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  // ADD SUBJECT
  const addSubject = async () => {
    if (!subject.trim()) return;

    await addDoc(subjectsCollection, {
      name: subject,
      category,
      user: user.email,
    });

    setSubject("");
    loadSubjects();
  };

  // DELETE
  const deleteSubject = async (id) => {
    await deleteDoc(doc(db, "subjects", id));
    loadSubjects();
  };

  if (loading)
    return <h2 style={{ textAlign: "center" }}>⏳ Loading...</h2>;

  return (
    <div style={styles.wrapper}>
      
      {/* 🎥 VIDEO BACKGROUND */}
      <video autoPlay loop muted playsInline style={styles.video}>
        <source src="/bgvid.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div style={styles.overlay(darkMode)}></div>

      {/* CONTENT */}
      <div style={styles.container}>

        {/* 🌙 TOGGLE */}
        {user && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={styles.toggle}
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        )}

        {/* LOGIN SCREEN */}
        {step === "login" && (
          <div style={styles.card}>
            <h1>📚 Study Planner</h1>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button onClick={login} style={styles.btn}>
              🔐 Login
            </button>

            <button onClick={signup} style={styles.btnOutline}>
              ✨ Signup
            </button>
          </div>
        )}

        {/* CATEGORY SCREEN */}
        {step === "category" && (
          <div style={styles.card}>
            <h2>📂 Select Category</h2>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.input}
            >
              <option value="">Choose</option>
              <option>School 📘</option>
              <option>College 🎓</option>
              <option>Exams 📝</option>
              <option>Placement 💼</option>
            </select>

            <button
              onClick={() => setStep("subjects")}
              style={styles.btn}
            >
              ➡ Continue
            </button>

            <button onClick={() => signOut(auth)} style={styles.logout}>
              🚪 Logout
            </button>
          </div>
        )}

        {/* SUBJECT SCREEN */}
        {step === "subjects" && (
          <div style={styles.card}>
            <h2>📚 Subjects</h2>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              style={styles.input}
            />

            <button onClick={addSubject} style={styles.btn}>
              ➕ Add
            </button>

            <div>
              {subjects.map((s) => (
                <div key={s.id} style={styles.subjectCard}>
                  📘 {s.name}
                  <button
                    onClick={() => deleteSubject(s.id)}
                    style={styles.delete}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setStep("category")} style={styles.btnOutline}>
              🔙 Back
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
const styles = {
  wrapper: {
    height: "100vh",
    fontFamily: "Algerian, sans-serif",
    overflow: "hidden",
  },

  video: {
    position: "fixed",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -2,
  },

  overlay: (dark) => ({
    position: "fixed",
    width: "100%",
    height: "100%",
    background: dark
      ? "rgba(0,0,0,0.6)"
      : "rgba(255,255,255,0.3)",
    zIndex: -1,
  }),

  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "350px",
    padding: "20px",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.2)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    textAlign: "center",
  },

  input: {
    width: "90%",
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
    border: "none",
  },

  btn: {
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    background: "#6c63ff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  btnOutline: {
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    background: "transparent",
    border: "2px solid white",
    color: "white",
  },

  toggle: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: "8px",
    borderRadius: "10px",
    border: "none",
  },

  logout: {
    marginTop: "10px",
    background: "black",
    color: "white",
    padding: "8px",
    borderRadius: "10px",
    border: "none",
  },

  subjectCard: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.4)",
    display: "flex",
    justifyContent: "space-between",
  },

  delete: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};