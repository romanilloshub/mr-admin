import {
  database as fakeDatabase,
  auth as fakeAuth,
  googleAuthProvider as fakeGoogleAuthProvider,
  githubAuthProvider as fakeGithubAuthProvider,
  facebookAuthProvider as fakeFacebookAuthProvider,
  twitterAuthProvider as fakeTwitterAuthProvider,
  passwordResetEmail as fakePasswordResetEmail,
} from "./fake";

import firebaseInit from "./real";

let database = fakeDatabase;
let auth = fakeAuth;
let googleAuthProvider = fakeGoogleAuthProvider;
let githubAuthProvider = fakeGithubAuthProvider;
let facebookAuthProvider = fakeFacebookAuthProvider;
let twitterAuthProvider = fakeTwitterAuthProvider;
let passwordResetEmail = fakePasswordResetEmail;

if (process.env.REACT_APP_FAKE_AUTH_MODE !== "true") {
  const {
    database: realDatabase,
    auth: realAuth,
    googleAuthProvider: realGoogleAuthProvider,
    githubAuthProvider: realGithubAuthProvider,
    facebookAuthProvider: realFacebookAuthProvider,
    twitterAuthProvider: realTwitterAuthProvider,
    passwordResetEmail: realPasswordResetEmail,
  } = firebaseInit();

  database = realDatabase;
  auth = realAuth;
  googleAuthProvider = realGoogleAuthProvider;
  githubAuthProvider = realGithubAuthProvider;
  facebookAuthProvider = realFacebookAuthProvider;
  twitterAuthProvider = realTwitterAuthProvider;
  passwordResetEmail = realPasswordResetEmail;
}

export {
  database,
  auth,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider,
  passwordResetEmail,
};
