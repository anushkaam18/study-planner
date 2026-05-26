import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const subjectsCollection = collection(db, "subjects");

/**
 * Subscribes to subjects associated with a specific user email in real-time.
 * This is highly optimized and secures data access at the query level.
 * 
 * @param {string} userEmail - The email of the currently authenticated user
 * @param {function} callback - Callback function triggered with the latest subjects list
 * @returns {function} Unsubscribe function to clean up the listener
 */
export const subscribeToSubjects = (userEmail, callback) => {
  if (!userEmail) return () => {};

  // Secure Firestore Query: Filters on the database level rather than downloading all records!
  const q = query(subjectsCollection, where("user", "==", userEmail));

  return onSnapshot(
    q,
    (snapshot) => {
      const subjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(subjects);
    },
    (error) => {
      console.error("Firestore subscription error:", error);
    }
  );
};

/**
 * Creates a new subject document in Firestore.
 * 
 * @param {string} subjectName - The name of the subject
 * @param {string} category - The category chosen (e.g., School, College)
 * @param {string} userEmail - The email of the active user
 */
export const addSubject = async (subjectName, category, userEmail) => {
  if (!subjectName.trim() || !category || !userEmail) return;

  try {
    await addDoc(subjectsCollection, {
      name: subjectName.trim(),
      category,
      user: userEmail,
      createdAt: new Date(), // Storing creation timestamp is best practice for sorting
    });
  } catch (error) {
    console.error("Failed to add subject:", error);
    throw error;
  }
};

/**
 * Deletes a subject document by its document ID.
 * 
 * @param {string} id - The Firestore document ID
 */
export const deleteSubject = async (id) => {
  if (!id) return;

  try {
    await deleteDoc(doc(db, "subjects", id));
  } catch (error) {
    console.error("Failed to delete subject:", error);
    throw error;
  }
};
