import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

function App({ user }) {
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const subjectsCollection = collection(db, "subjects");

  // 🔥 LOAD SUBJECTS (FIXED)
  const loadSubjects = async () => {
    if (!user) return;

    const data = await getDocs(subjectsCollection);

    const filtered = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter((item) => item.user === user.email);

    setSubjects(filtered);
  };

  // 🔥 WAIT FOR USER (IMPORTANT FIX)
  useEffect(() => {
    if (user) {
      loadSubjects();
    }
  }, [user]);

  // ➕ ADD SUBJECT
  const addSubject = async () => {
    if (!subject.trim() || !user) return;

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

  // ✏️ UPDATE
  const updateSubject = async (id) => {
    if (!editText.trim()) return;

    await updateDoc(doc(db, "subjects", id), {
      name: editText,
    });

    setEditId(null);
    setEditText("");
    loadSubjects();
  };

  return (
    <div style={styles.container(darkMode)}>
      <h1>📚 Study Planner</h1>

      {/* 🔐 USER CHECK */}
      {!user ? (
        <p>Loading user...</p>
      ) : (
        <>
          <p>Welcome, {user.email}</p>

          {/* 🌙 DARK MODE */}
          <button onClick={() => setDarkMode(!darkMode)} style={styles.btn}>
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>

          {/* ➕ ADD */}
          <div style={{ marginTop: "20px" }}>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              style={styles.input(darkMode)}
            />
            <button onClick={addSubject} style={styles.btn}>
              Add Subject
            </button>
          </div>

          {/* 📚 LIST */}
          <div style={{ marginTop: "30px" }}>
            {subjects.length === 0 ? (
              <p>No subjects yet</p>
            ) : (
              subjects.map((sub) => (
                <div key={sub.id} style={styles.card(darkMode)}>
                  {editId === sub.id ? (
                    <>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        style={styles.input(darkMode)}
                      />
                      <button
                        onClick={() => updateSubject(sub.id)}
                        style={styles.btn}
                      >
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
                        ✏️ Edit
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteSubject(sub.id)}
                    style={styles.delete}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 🚪 LOGOUT */}
          <button onClick={() => signOut(auth)} style={styles.logout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;

// 🎨 STYLES
const styles = {
  container: (dark) => ({
    textAlign: "center",
    minHeight: "100vh",
    padding: "20px",
    background: dark ? "#121212" : "#f5f5f5",
    color: dark ? "#fff" : "#000",
  }),

  input: (dark) => ({
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: dark ? "#333" : "#fff",
    color: dark ? "#fff" : "#000",
  }),

  btn: {
    padding: "10px 15px",
    margin: "5px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#6c63ff",
    color: "#fff",
  },

  delete: {
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "red",
    color: "#fff",
  },

  logout: {
    marginTop: "30px",
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "black",
    color: "#fff",
  },

  card: (dark) => ({
    padding: "15px",
    margin: "10px auto",
    borderRadius: "15px",
    width: "250px",
    background: dark ? "#1e1e1e" : "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  }),
};