import { collection, addDoc, serverTimestamp, getDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'
import { remove } from 'firebase/database';

/**
 * 
 * @param collectionName name of the collection in firestore
 * @param object object to be stored
 * @returns The ID of the newly created document in Firestore
 */
export async function addItem(collectionName: string, object: any): Promise<string> {
    console.log("Adding item to collection:", collectionName, "with data:", object);

    console.log("Firestore database instance:", db);

    const collectionRef = collection(db, '/' + collectionName);
    console.log("Collection reference:", collectionRef);

    const docRef = await addDoc(collection(db, '/' + collectionName), {
        ...object,
        createdAt: serverTimestamp()
    })

    return docRef.id
}

export async function getItems<T>(collectionName: string): Promise<T[]> {
    const docs = await getDocs(collection(db, '/' + collectionName));
    console.log(docs.docs.map(doc => doc.id));
    return docs.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

export async function getItemById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, '/' + collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
        return null;
    }

}

export async function removeItem(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
}

export async function updateItem(collectionName: string, id: string, object: any): Promise<void> {
    const docRef = doc(db, collectionName, id);
    console.log(docRef);
    await updateDoc(docRef, {
        ...object,
        updatedAt: serverTimestamp()
    });
}