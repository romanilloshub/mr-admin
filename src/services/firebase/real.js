import firebase from "firebase";

// Initialize
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const init = () => {
  firebase.initializeApp(config);

  const auth = firebase.auth();

  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
  const githubAuthProvider = new firebase.auth.GithubAuthProvider();
  const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

  const passwordResetEmail = async (email) =>
    auth.sendPasswordResetEmail(email);

  const database = firebase.database();

  return {
    database,
    auth,
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
    passwordResetEmail,
  };
};

export default init;
