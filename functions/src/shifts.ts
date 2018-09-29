import * as functions from 'firebase-functions';
import { parse } from 'querystring';

import { firebase } from './../config';

const db = firebase.firestore().collection('shifts');

const getTeamShifts = (req: functions.Request, res: functions.Response) => {
  const params = parse(req.url.split('?')[1])
  if (params.id) {
    const id = params.id;
    db.where('captain', '==', id).get()
    .then(snapshot => {
      const data = [];
      snapshot.docs.forEach(doc => {
        data.push(doc.data());
      })
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

const getUniqueShifts = (req: functions.Request, res: functions.Response) => {
  const params = parse(req.url.split('?')[1]);
  if (params.id) {
    const id = params.id.toString();
    db.doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        return res.status(200).json({
            message: 'Data successfully grabbed.',
            data,
        })
      } else {
        return res.status(400).json({
            message: `Document with id, ${id}, does not exist.`
        })
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({
          message: `Firebase threw error. More details in error element of response.`,
          error: err,
      });
    })
  } else {
    return res.status(400).json({
      message: 'Please add valid id value to parameter.'
    })
  }
  return res;
}

const putShift = (req: functions.Request, res: functions.Response) => {

};

const postShift = (req: functions.Request, res: functions.Response) => {

};

const shifts = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET': {
      return getTeamShifts(req, res);
    }
    case 'PUT': {
      return putShift(req, res);
    }
    case 'POST': {
      return postShift(req, res);
    }
    default: {
      return res.status(400).json({
        message: 'HTTPS method not recognized and/or supported.',
      })
    }
  }
});

const shift = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  switch (req.method) {
    case 'GET': {
      return getUniqueShifts(req, res);
    }
    default: {
      return res.status(400).json({
        message: 'HTTPS method not recognized and/or supported.',
      })
    }
  }
})

export {
  shifts,
  shift,
};
