import * as functions from 'firebase-functions';
import { firebase } from './../config';

const newUserSignIn = functions.auth.user().onCreate(user => {
  const data = {
    email: user.data.email,
    name: user.data.displayName,
    photo: user.data.photoURL,
    createdAt: user.timestamp,
    lastSignIn: user.timestamp,
  };
  return firebase.firestore().collection('users').add(data)
  .then(ref => {
    return true;
  })
  .catch(err => {
    console.error('firestore add failed', err);
    return false;
  })
})

export {
  newUserSignIn,
}
