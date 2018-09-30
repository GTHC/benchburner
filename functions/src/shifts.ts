import * as functions from 'firebase-functions';
import { parse } from 'querystring';

import { firebase } from './../config';

const db = firebase.firestore().collection('shifts');

/*
Helper Functions
 */

const checkNewShiftData = (data) => (data.captain && data.startTime && data.endTime && data.users);

const getTeamShifts = (req: functions.Request, res: functions.Response) => {
  const params = parse(req.url.split('?')[1])
  if (params.id) {
    const id = params.id;
    db.where('captain', '==', id).get()
    .then(snapshot => {
      const allData = [];
      snapshot.docs.forEach(doc => {
        const docData = doc.data()
        const data = {
          id: doc.id,
          ...docData
        };
        allData.push(data);
      })
      return res.status(200).json({
          message: allData.length !== 0 ? 'Data successfully grabbed.' : 'No shift data under this id.',
          allData,
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

const getUniqueShift = (req: functions.Request, res: functions.Response) => {
  const params = parse(req.url.split('?')[1]);
  if (params.id) {
    const id = params.id.toString();
    db.doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const docData = doc.data()
        const data = {
          id: doc.id,
          ...docData
        };
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
  if (!req.body) {
    return res.status(400).json({
      message: 'Please make request with shift data. No data found in request body.'
    });
  }
  if (!req.body.id) {
    return res.status(400).json({
      message: 'Shift id not found in request body.',
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
    console.error(err)
    return res.status(500).json({
        message: `Firebase threw error. More details in error element of response.`,
        error: err,
    });
  })
  return res;
}

const postShift = (req: functions.Request, res: functions.Response) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Please make request with shift data. No data found in request body.'
    });
  }
  if (!req.body.captain) {
    return res.status(400).json({
      message: 'Shift captain not found in request body.',
    });
  }
  if(!checkNewShiftData(req.body)) {
    return res.status(400).json({
      message: 'Make sure request body includes a captain, startTime, endTime, and users elements.',
    });
  }
  db.add(req.body)
  .then(ref => {
    res.status(200).json({
      message: 'Post is successful.'
    })
  })
  .catch(err => {
    console.error(err)
    return res.status(500).json({
        message: `Firebase threw error. More details in error element of response.`,
        error: err,
    });
  })
  return res;
}

const shifts = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET': {
      return getTeamShifts(req, res);
    }
    default: {
      return res.status(400).json({
        message: 'HTTPS method not recognized and/or supported.',
      })
    }
  }
});

/*
Cloud Functions
 */
const shift = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  switch (req.method) {
    case 'GET': {
      return getUniqueShift(req, res);
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
})

export {
  shifts,
  shift,
};
