var admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const firebaseConfig = {
    type: process.env.PROJECT_TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
};

initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});

const db = getFirestore();

// Lay tat ca data tu trong bang
const fetchAllData = async (collection) => {
    const snapshot = await db.collection(collection).get();
    let data = snapshotToArray(snapshot);
    return data.filter(function (d) {
        return d.status !== false;
    });
};

// Lay 1 document = id
const fetchDataById = async (collection, id) => {
    const snapshot = await db.collection(collection).doc(id).get();
    if (!snapshot.exists) {
        return -1;
    }
    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
};

// Lay document theo 1 field nao day
const fetchMatchingDataByField = async (collection, field, keyword) => {
    const snapshot = await db
        .collection(collection)
        .where(field, "==", keyword)
        .get();
    if (snapshot.empty) {
        return -1;
    }
    let data = snapshotToArray(snapshot);
    return data;
};

// Add data to collection
const addData = async (collection, obj) => {
    const res = await db.collection(collection).add(obj);
    return {
        msg: "Added data with ID: " + res.id,
    };
};

// Add data da co id 
const setData = async (collection, id, obj) => {
    await db.collection(collection).doc(id).set(obj);
    console.log("Set data with ID: " + id);
    return {
        msg: "Set data with ID: " + id,
    };
};

// Update data
const updateData = async (collection, id, obj) => {
    await db.collection(collection).doc(id).update(obj);
    return {
        msg: "Updated data with ID: " + id,
    };
};

// Xoa data
const deleteData = async (collection, id) => {
    try {
        await db.collection(collection).doc(id).delete({ recursive: true });
        return true;
    } catch (e) {
        return false;
    }
};

// Helper function de convert firebase format -> json format
const snapshotToArray = (snapshot) => {
    let docs = [];

    snapshot.forEach((doc) => {
        docs.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    return docs;
};

// Xoa collection
async function deleteCollection(collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy("__name__").limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

module.exports = {
    db,
    fetchAllData,
    fetchDataById,
    fetchMatchingDataByField,
    addData,
    setData,
    updateData,
    deleteData,
    snapshotToArray,
    deleteCollection,
};
