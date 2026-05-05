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

  const subjectsCollection = collection(db, "subjects");

  // 🔥 FIXED AUTH LISTENER (with fallback)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // 🚨 fallback: never stay stuck
    setTimeout(() => {
      setLoading(false);
    }, 2000);

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

  // 🚨 LOADING SCREEN (FIXED)
  if (loading) return <h2>Loading...</h2>;

  // 🔐 LOGIN UI
  if (!user) {
    return (
      <div style={styles.container}>
        <h1>Study Planner</h1>

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
          Login
        </button>

        <button onClick={signup} style={styles.btn}>
          Signup
        </button>
      </div>
    );
  }

  // 📚 MAIN APP
  return (
    <div style={styles.container}>
      <h1>📚 Study Planner</h1>
      <p>{user.email}</p>

      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter subject"
        style={styles.input}
      />

      <button onClick={addSubject} style={styles.btn}>
        Add
      </button>

      {subjects.map((sub) => (
        <div key={sub.id} style={styles.card}>
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

// 🎨 styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  input: {
    padding: "10px",
    margin: "10px",
    borderRadius: "8px",
  },
  btn: {
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    background: "#6c63ff",
    color: "white",
    border: "none",
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
  card: {
    margin: "10px",
    padding: "10px",
    borderRadius: "10px",
    background: "#eee",
  },
};