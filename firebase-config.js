// Firebase 配置
const firebaseConfig = {
    apiKey: "你的apiKey",
    authDomain: "你的authDomain",
    projectId: "你的projectId",
    storageBucket: "你的storageBucket",
    messagingSenderId: "你的messagingSenderId",
    appId: "你的appId"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 导出数据库和存储的引用
const db = firebase.firestore();
const storage = firebase.storage();

// 导出供其他文件使用
window.db = db;
window.storage = storage; 