import * as functions from 'firebase-functions';
import { parse } from 'querystring';

import { firebase } from './../config';

const db = firebase.firestore().collection('users')

const newUserSignIn = functions.auth.user().onCreate(user => {
  const data = {
    email: user.data.email,
    name: user.data.displayName,
    photo: user.data.photoURL,
    createdAt: user.timestamp,
    lastSignIn: user.timestamp,
  };
  return db.add(data)
  .then(ref => {
    return true;
  })
  .catch(err => {
    console.error('firestore add failed', err);
    return false;
  })
})

const getUser = functions.https.onRequest((req, res) => {
  const params = parse(req.url.split('?')[1])
  if (params.id) {
    const id = params.id;
    db.where('email', '==', id).get()
    .then(snapshot => {
      const data = snapshot.docs[0].data();
      return res.status(200).json({
          message: 'Data successfully grabbed.',
          data,
      })
    })
    .catch(err => {
      console.error(err)
    })
  } else {
    return res.status(400).json({
      message: 'Please add valid id value to parameter.'
    })
  }
  return res;
});

export {
  newUserSignIn,
  getUser
}
