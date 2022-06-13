const user = {
  uid: "d8d4d41c-6dc1-431c-a84d-83ee8fbf718c",
  displayName: "Fake User",
  email: "fake@user.com",
  photoURL: "https://google.com",
  getIdTokenResult: () => ({
    claims: {
      roles: ["talent", "admin", "client"],
    },
  }),
  getIdToken: async () => {
    return "FAKE_FAKE";
  },
};

const auth = {
  onAuthStateChanged: async (callback) => {
    callback(user);
  },
  currentUser: user,
};

const googleAuthProvider = {};
const facebookAuthProvider = {};
const githubAuthProvider = {};
const twitterAuthProvider = {};

const passwordResetEmail = async (email) => {};

const database = {};

export {
  database,
  auth,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider,
  passwordResetEmail,
};
