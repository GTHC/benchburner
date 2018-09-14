import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((req, res) => {
  console.log('request: ', req.headers)
  res.status(200).json({
    status: 200,
    message: 'Request is successful'
  })
});

export { default as testFunction } from './testFunctions';
