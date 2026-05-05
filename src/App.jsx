import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const[category, setCategory] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const subjectsCollection = collection(db, "subjects");

  // 🔐 AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // fallback
    setTimeout(() => setLoading(false), 2000);

    return () => unsubscribe();
  }, []);

  // 📥 LOAD SUBJECTS
  const loadSubjects = async () => {
    if (!user) return;

    const data = await getDocs(subjectsCollection);

    const filtered = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter((item) => item.user === user.email);

    setSubjects(filtered);
  };

  useEffect(() => {
    if (user) loadSubjects();
  }, [user]);

  // 🔐 LOGIN
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔐 SIGNUP
  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // ➕ ADD
  const addSubject = async () => {
    if (!subject.trim() || !category) {
      alert("PLEASE SELECT CATEGORY AND ENTER SUBJECT")
        return;
    }

    await addDoc(subjectsCollection, {
      name: subject,
      category: category,
      user: user.email,
    });

    setSubject("");
    setCategory("");
    loadSubjects();
  };

  // 🗑 DELETE
  const deleteSubject = async (id) => {
    await deleteDoc(doc(db, "subjects", id));
    loadSubjects();
  };

  // ✏️ EDIT
  const updateSubject = async (id) => {
    if (!editText.trim()) return;

    await updateDoc(doc(db, "subjects", id), {
      name: editText,
    });

    setEditId(null);
    setEditText("");
    loadSubjects();
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  // 🔐 LOGIN UI
  if (!user) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
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

          <button onClick={login} style={styles.btnFull}>
            Login
          </button>

          <button onClick={signup} style={styles.btnOutline}>
            Signup
          </button>
        </div>
      </div>
    );
  }

  // 📚 MAIN APP
  return (
    <div style={styles.container(darkMode)}>
      <h1>📚 Study Planner</h1>
      <p>{user.email}</p>

      <button onClick={() => setDarkMode(!darkMode)} style={styles.btn}>
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  style={styles.input}
>
  <option value="">Select Category</option>
  <option>Class 4-8</option>
  <option>Class 9-10</option>
  <option>Class 11-12</option>
  <option>College</option>
  <option>Placement</option>
  <option>Government Exams</option>
  <option>Entrance Exams</option>
</select>

      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter subject"
        style={styles.input}
      />
      
      <button onClick={addSubject} style={styles.btn}>
        Add
      </button>

      <div style={styles.grid}>
        {subjects.map((sub) => (
          <div key={sub.id} style={styles.card(darkMode)}>
            {editId === sub.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={styles.input}
                />
                <button onClick={() => updateSubject(sub.id)} style={styles.btn}>
                  Save
                </button>
              </>
            ) : (
              <>
                <h3>{sub.name}</h3>
                <p>{sub.category}</p>
                <button
                  onClick={() => {
                    setEditId(sub.id);
                    setEditText(sub.name);
                  }}
                  style={styles.btn}
                >
                  ✏️ Edit
                </button>
              </>
            )}

            <button onClick={() => deleteSubject(sub.id)} style={styles.delete}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

export default App;

// 🎨 STYLES
const styles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  loginCard: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "300px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  },
  container: (dark) => ({
  textAlign: "center",
  padding: "20px",
  minHeight: "100vh",

  backgroundImage: "url('/bg.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",

  backgroundColor: dark
    ? "rgba(0,0,0,0.6)"
    : "rgba(255,255,255,0.6)",

  backgroundBlendMode: "overlay",

  color: dark ? "#fff" : "#000",
}),
  input: {
    padding: "10px",
    margin: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  btn: {
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    background: "#6c63ff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  btnFull: {
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    background: "#6c63ff",
    color: "white",
    border: "none",
  },
  btnOutline: {
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    background: "transparent",
    color: "#6c63ff",
    border: "2px solid #6c63ff",
  },
  delete: {
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    background: "red",
    color: "white",
    border: "none",
  },
  logout: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    background: "black",
    color: "white",
    border: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  card: (dark) => ({
    padding: "15px",
    borderRadius: "12px",
    background: dark ? "#1e1e1e" : "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  }),
};