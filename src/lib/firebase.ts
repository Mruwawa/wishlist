// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAuth, GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtXfkw_XGTeB0mJTeEFHssmNK8zhKyYkc",
    authDomain: "wishlist-db8fb.firebaseapp.com",
    projectId: "wishlist-db8fb",
    storageBucket: "wishlist-db8fb.firebasestorage.app",
    messagingSenderId: "639822612341",
    appId: "1:639822612341:web:32854b62e7b6afd416353c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
    console.log("Running in development mode");
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
}

export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
        "618e8ad8-1d39-4a25-83de-ff34afedae55"
    ),
    isTokenAutoRefreshEnabled: true
})

