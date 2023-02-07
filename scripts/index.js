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
} from "firebase/firestore";

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
	name: "Marcos",
	surname: "Santos",
	grades: {
		grade1: 9.6,
		grade2: 7.5,
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

addingDoc(db, myCollection, newDoc);

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

delDoc(db, myCollection, "ixiteMAbmmaI8jjzAb89");

const updatedData = {
	"grades.grade1": 5.7,
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

updatingDocById(db, myCollection, "BcJYQmWwBIMZWYsdLvQu", updatedData);
