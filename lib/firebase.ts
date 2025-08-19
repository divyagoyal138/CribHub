import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAm6Cyv28GoDuoMo54c8Jc7GyNfbQS6po4",
    authDomain: "cribhub-6cd9d.firebaseapp.com",
    projectId: "cribhub-6cd9d",
    storageBucket: "cribhub-6cd9d.firebasestorage.app",
    messagingSenderId: "191223723145",
    appId: "1:191223723145:web:ddf11c79ea463d54970258",
    measurementId: "G-3J9WXEE5YN"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics only in the browser when supported
if (typeof window !== "undefined") {
    void isAnalyticsSupported().then((supported) => {
        if (supported) {
            getAnalytics(app);
        }
    });
}

export const db = getFirestore(app);
export { app };

// Initialize and persist Auth in the browser
export const auth = getAuth(app);
if (typeof window !== "undefined") {
    void setPersistence(auth, browserLocalPersistence).catch(() => {
        // ignore persistence errors in non-browser contexts
    });
}


