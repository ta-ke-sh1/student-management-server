const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

initializeApp({
    credential: cert(firebaseConfig)
});

const db = getFirestore();

const fetchAllData = async (collection) => {
    const res = [];
    const snapshot = await db.collection(collection).get();
    snapshot.forEach((doc) => {
        res.push({
            id: doc.id,
            data: doc.data()
        })
    })
    return res;
}

export {
    fetchAllData,
}