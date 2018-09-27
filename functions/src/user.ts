import * as functions from 'firebase-functions';
import { parse } from 'querystring';

import { firebase } from './../config';

const db = firebase.firestore().collection('users')

/*
Helper functions - tslint requires helper functions to be declared before higher-level functions
 */

/**
 * getUser - gets a users documents data using the id specified in the id parameter of the URL
 */
const getUser = (req: functions.Request, res: functions.Response) => {
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
};

/**
 * putUser - adds data to existing documents under 'users' collection
 * (reminder) this is a PUT request, which is only meant to store onto already existing entities. The alternative of adding data to create would be making POST requests.*
 */
const putUser = (req: functions.Request, res: functions.Response) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Please make request with user data. No data found in request body.'
    });
  }
  if (!req.body.id) {
    return res.status(400).json({
      message: 'User id not found. Make sure to clarify user id in request body.',
    });
  }
  const id = req.body.id;
  db.doc(id).set(req.body, { merge: true, })
  .then(ref => {
    res.status(200).json({
      message: 'Put is successful.'
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err,
    })
  })
  return res;
}

/*
Cloud Functions
 */

 const newUserSignIn = functions.auth.user().onCreate(userSnapshot => {
   const data = {
     email: userSnapshot.data.email,
     name: userSnapshot.data.displayName,
     photo: userSnapshot.data.photoURL,
     createdAt: userSnapshot.timestamp,
     lastSignIn: userSnapshot.timestamp,
   };
   return db.doc(data.email).set(data)
   .then(ref => {
     return true;
   })
   .catch(err => {
     console.error('firestore add failed', err);
     return false;
   })
 })

 /**
  * user - API endpoint that takes GET, and PUT requests to the user collection
  */
 const user = functions.https.onRequest((req, res) => {
   switch (req.method) {
     case 'GET': {
       return getUser(req, res);
     }
     case 'PUT': {
       return putUser(req, res);
     }
     default: {
       return res.status(400).json({
         message: 'HTTPS method not recognized and/or supported.',
       })
     }
   }
 });

export {
  newUserSignIn,
  user
}
