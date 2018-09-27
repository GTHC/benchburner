import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export { default as testFunction } from './testFunction';

export { newUserSignIn, user } from './user';

export { team } from './team';
