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

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const subjectsCollection = collection(db, "subjects");

  // 🔐 AUTH LISTENER (FIX)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

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
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🔐 SIGNUP
  const signup = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // ➕ ADD
  const addSubject = async () => {
    if (!subject.trim()) return;

    await addDoc(subjectsCollection, {
      name: subject,
      user: user.email,
    });

    setSubject("");
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

  if (loading) return <p>Loading...</p>;

  // 🔐 LOGIN PAGE
  if (!user) {
    return (
      <div style={styles.container(false)}>
        <h1>Login / Signup</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input(false)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input(false)}
        />

        <button onClick={login} style={styles.btn}>Login</button>
        <button onClick={signup} style={styles.btn}>Signup</button>
      </div>
    );
  }

  // 📚 MAIN APP
  return (
    <div style={styles.container(darkMode)}>
      <h1>📚 Study Planner</h1>
      <p>{user.email}</p>

      <button onClick={() => setDarkMode(!darkMode)} style={styles.btn}>
        Toggle Mode
      </button>

      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter subject"
        style={styles.input(darkMode)}
      />
      <button onClick={addSubject} style={styles.btn}>
        Add
      </button>

      {subjects.map((sub) => (
        <div key={sub.id} style={styles.card(darkMode)}>
          {editId === sub.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={styles.input(darkMode)}
              />
              <button onClick={() => updateSubject(sub.id)} style={styles.btn}>
                Save
              </button>
            </>
          ) : (
            <>
              <h3>{sub.name}</h3>
              <button
                onClick={() => {
                  setEditId(sub.id);
                  setEditText(sub.name);
                }}
                style={styles.btn}
              >
                Edit
              </button>
            </>
          )}

          <button onClick={() => deleteSubject(sub.id)} style={styles.delete}>
            Delete
          </button>
        </div>
      ))}

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

export default App;

// 🎨 STYLES
const styles = {
  container: (dark) => ({
    textAlign: "center",
    padding: "20px",
    minHeight: "100vh",
    background: dark ? "#121212" : "#f5f5f5",
    color: dark ? "#fff" : "#000",
  }),
  input: () => ({
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
  }),
  btn: {
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    background: "#6c63ff",
    color: "#fff",
    border: "none",
  },
  delete: {
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    background: "red",
    color: "#fff",
    border: "none",
  },
  logout: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "10px",
    background: "black",
    color: "#fff",
    border: "none",
  },
  card: (dark) => ({
    margin: "10px",
    padding: "10px",
    borderRadius: "10px",
    background: dark ? "#1e1e1e" : "#fff",
  }),
};