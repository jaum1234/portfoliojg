import admin from "firebase-admin";
import "dotenv/config"

const credential = process.env.NODE_ENV === 'production' ?
  admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
  :
  admin.credential.applicationDefault();

admin.initializeApp({
  credential
});

const db = admin.firestore();

export default db;