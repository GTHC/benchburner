import * as functions from 'firebase-functions';
import { firebase } from './../config';

const testFunction = functions.https.onRequest((req, res) => {
  const params = req.url.split('/')
  switch (req.method) {
    case 'GET': {
      if (params[1]) {
        const id = params[1];
        firebase.firestore().doc(`test/${id}`).get()
        .then(snapshot => {
          const data = snapshot.data()
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
    }
    case 'PUT': {
      firebase.firestore().collection('test').add(req.body)
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
    default: {
      return res.send('def')
    }
  }
});

export default testFunction;
