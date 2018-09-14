import * as functions from 'firebase-functions';
import { admin } from './../../config';

const testFunction = functions.https.onRequest((req, res) => {
  const params = req.url.split('/')
  console.log(params)
  console.log(req.method)
  switch (req.method) {
    case 'GET': {
      if (params[1]) {
        const id = params[1];
        admin.firestore().doc(`test/${id}`).get()
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
    default: {
      return res.status(400).json({
        error: `${req.method} is not supported at this endpoint`
      });
    }
  }
});

export default testFunction;
