import { signInWithPopup, signOut, onAuthStateChanged, type User, GoogleAuthProvider, getAuth } from 'firebase/auth'
import { writable } from 'svelte/store'
import { app } from './firebase'
import { getFirestore } from 'firebase/firestore/lite'

export const user = writable<User | null>(null)
export const authReady = writable(false)

const auth = getAuth(app)
// const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

onAuthStateChanged(auth, (currentUser) => {
    user.set(currentUser)
    authReady.set(true)
})

export async function loginWithGoogle() {
    console.log(auth)
    console.log(googleProvider)
    try {
        await signInWithPopup(auth, googleProvider)
    } catch (error) {
        console.error("Login failed", error)
    }
}

export async function logout() {
    await signOut(auth)
}