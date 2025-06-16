// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';//認証機能用
// Firebase構成オブジェクト(コンソールからコピペ)
// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyA2ak8246v4PBGNjUHZy70mzPMdHe4yHN0",
  // authDomain: "y24516-20250519.firebaseapp.com",
  // projectId: "y24516-20250519",
  // storageBucket: "y24516-20250519.firebasestorage.app",
  // messagingSenderId: "1513871885",
  // appId: "1:1513871885:web:770caa01cd8f0517ddd344"
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// 初期化
const app = initializeApp(firebaseConfig);
// Firestoreデータベースを使う準備
const db = getFirestore(app);
// Firebase認証(Auth)を使う準備
const auth = getAuth(app); // 認証サービス本体
const provider = new GoogleAuthProvider(); // Googleログイン専用の「認証プロバイダ」

// 他のファイルでも使えるように、エクスポート
export { db, auth, provider };