import { env } from "../dotenv";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

const db = getFirestore();
const myCollection = "classA";
const auth = getAuth();

// Buttons
const addingBtn = document.getElementById("addButton");
const deleteBtn = document.getElementById("delButton");
const updatingBtn = document.getElementById("updButton");
const loginBtn = document.getElementById("loginButton");
const logoutBtn = document.getElementById("logoutButton");

auth.onAuthStateChanged((user) => {
  user ? console.log("User logged in", user) : console.log("No user logged in");
});

const getSnapshot = (database, collReference, id) => {
  try {
    onSnapshot(doc(database, collReference, id), (doc) => {
      console.log("getSnapshot", doc.data());
    });
  } catch (error) {
    console.log("getSnapshot error", error);
  }
};

getSnapshot(db, myCollection, "BcJYQmWwBIMZWYsdLvQu");

const getAllDocuments = async (database, collReference) => {
  try {
    const myDocs = [];

    const colRef = collection(database, collReference);
    const resp = await getDocs(colRef);
    const docs = resp.docs;

    docs.forEach((doc) => myDocs.push({ ...doc.data(), id: doc.id }));
    console.log("myDocs getAllDocuments", myDocs);
  } catch (error) {
    console.log("getAllDocuments error:", error);
  }
};

getAllDocuments(db, myCollection);

const getDocById = async (database, collReference, id) => {
  try {
    const docById = doc(database, collReference, id);
    const resp = await getDoc(docById);

    const uniqueDoc = resp.data();
    console.log("uniqueDoc getDocById", uniqueDoc);
    return uniqueDoc;
  } catch (error) {
    console.log("getDocById error:", error);
  }
};

getDocById(db, myCollection, "BcJYQmWwBIMZWYsdLvQu");

const getDocByName = async (database, collReference, name) => {
  try {
    const docsByName = [];

    const condition = query(
      collection(database, collReference),
      where("name", "==", name)
    );

    const resp = await getDocs(condition);
    const docsQuery = resp.docs;

    docsQuery.forEach((doc) => docsByName.push({ ...doc.data(), id: doc.id }));
    console.log("docsByName getDocByName", docsByName);
  } catch (error) {
    console.log("getDocByName error:", error);
  }
};

getDocByName(db, myCollection, "Marcos");

const newDoc = {
  name: "Gabrielle",
  surname: "Rodrigues",
  grades: {
    grade1: 7.6,
    grade2: 8.3,
  },
};

const addingDoc = async (database, collReference, data) => {
  try {
    console.log("Adding...");
    const addedDoc = await addDoc(collection(database, collReference), data);
    console.log("addedDoc addingDoc", addedDoc);
  } catch (error) {
    console.log("addingDoc error:", error);
  }
};

addingBtn.addEventListener("click", () => addingDoc(db, myCollection, newDoc));

const delDoc = async (database, collReference, id) => {
  try {
    const docExists = await getDocById(database, collReference, id);

    if (!docExists) throw new Error("The document already not exists!");

    const deletedDoc = await deleteDoc(doc(database, collReference, id));
    console.log("DeletedDoc delDoc", deletedDoc);
  } catch (error) {
    console.log("delDoc error:", error);
  }
};

deleteBtn.addEventListener("click", () =>
  delDoc(db, myCollection, "n7R13yStZEE3214aqWoN")
);

const updatedData = {
  "grades.grade1": 9.6,
};

const updatingDocById = async (database, collReference, id, data) => {
  try {
    const docExists = await getDocById(database, collReference, id);

    if (!docExists)
      throw new Error("No such document was found with the given ID!");

    const updatedDoc = await updateDoc(doc(database, collReference, id), data);
    console.log("updatedDoc updatingDocById", updatedDoc);
  } catch (error) {
    console.log("updatingDocById error:", error);
  }
};

updatingBtn.addEventListener("click", () =>
  updatingDocById(db, myCollection, "BcJYQmWwBIMZWYsdLvQu", updatedData)
);

const createUserEmailPass = async (authParam, email, password) => {
  try {
    console.log("Creating User...");
    const resp = await createUserWithEmailAndPassword(
      authParam,
      email,
      password
    );
    console.log("createUserEmailPass resp", resp);
  } catch (error) {
    console.log("createUserEmailPass error", error);
  }
};

// createUserEmailPass(auth, "newtest@test.com", "123456");

const loginPersistence = async () => {
  try {
    console.log("Persistence...");
    await setPersistence(auth, browserSessionPersistence);
  } catch (error) {
    console.log("loginPersistence error", error);
  }
};

const signInEmailPass = async (authParam, email, password) => {
  try {
    console.log("Logging In...");
    await loginPersistence();
    const resp = await signInWithEmailAndPassword(authParam, email, password);
    console.log("signInEmailPass", resp);
    console.log("signInEmailPass current user", auth.currentUser);
  } catch (error) {
    console.log("signInEmailPass error", error);
  }
};

loginBtn.addEventListener("click", () =>
  setTimeout(() => {
    loginBtn.innerText = "Logged In";
    logoutBtn.innerText = "Logout";
    signInEmailPass(auth, "newtest@test.com", "123456");
  }, 5000)
);

const signOutUser = async (authParam) => {
  try {
    console.log("Logging Out...");
    await signOut(authParam);
  } catch (error) {
    console.log("signOutUser error", error);
  }
};

logoutBtn.addEventListener("click", () =>
  setTimeout(() => {
    logoutBtn.innerText = "Logged Out";
    loginBtn.innerText = "Login";
    signOutUser(auth);
  }, 5000)
);
