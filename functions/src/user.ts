import * as functions from 'firebase-functions';
import { firebase } from './../config';

const newUserSignIn = functions.auth.user().onCreate(user => {
  console.log('New user sign in: ', user.data);
  console.log('New user sign in: ', user.data.providerData);
  return firebase.firestore().collection('users').add(user.data)
  .then(ref => {
    console.log('ref value', ref)
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
