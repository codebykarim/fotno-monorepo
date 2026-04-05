/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAJhhoykHhuiVI69lnKO-ly1djMbhSfuUk",
  authDomain: "fotno-490101.firebaseapp.com",
  projectId: "fotno-490101",
  storageBucket: "fotno-490101.firebasestorage.app",
  messagingSenderId: "685479940993",
  appId: "1:685479940993:web:2713deb9827f1048c1ce80",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  if (title) {
    self.registration.showNotification(title, {
      body,
      icon: "/logo.png",
      data: payload.data,
    });
  }
});
