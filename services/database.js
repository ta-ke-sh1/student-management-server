const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

initializeApp(firebaseConfig);

const db = getFirestore();

const fetchAllData = async (collection) => {
    let res = [];
    const snapshot = await db.collection(collection).get();
    snapshot.forEach((doc) => {
        res.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    return res;
};

const fetchDataById = async (collection, id) => {
    const snapshot = await db.collection(collection).doc(id).get();
    if (!snapshot.exists) {
        return -1;
    }
    return {
        id: snapshot.id,
        data: snapshot.data(),
    };
};

const fetchMatchingDataByField = async (collection, field, keyword) => {
    const docRef = db.collection(collection);
    const docs = await docRef.where(field, "==", keyword).get();
    if (docs.empty) {
        return -1;
    }
    let res = [];
    docs.forEach((doc) => {
        res.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    return res;
};

const addData = async (collection, obj) => {
    const res = await db.collection(collection).add(obj);
    return {
        msg: "Added data with ID: " + res.id,
    };
};

const setData = async (collection, id, obj) => {
    await db.collection(collection).doc(id).set(obj);
    return {
        msg: "Set data with ID: " + id,
    };
};

const updateData = async (collection, id, obj) => {
    await db.collection(collection).doc(id).update(obj);
    return {
        msg: "Updated data with ID: " + id,
    };
};

const deleteData = async (collection, id) => {
    await db.collection(collection).doc(id).delete();
    return {
        msg: "Deleted data with ID: " + id,
    };
};

module.exports = {
    fetchAllData,
    fetchDataById,
    fetchMatchingDataByField,
    addData,
    setData,
    updateData,
    deleteData,
};
