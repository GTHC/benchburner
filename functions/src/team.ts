import * as functions from 'firebase-functions';
import { parse } from 'querystring';

import { firebase } from './../config';

const db = firebase.firestore().collection('teams')

/**
 * checkNewTeamData - helper function for postTeam to check if new team data is valid
 */
const checkNewTeamData = (data) => (data.name && data.type && data.number && data.captain);

/**
 * getTeam - gets data from team document with required captain parameter
 */
const getTeam = (req: functions.Request, res: functions.Response) => {
  const params = parse(req.url.split('?')[1])
  if (params.captain) {
    const captain = params.captain;
    db.where('captain', '==', captain).get()
    .then(snapshot => {
      const data = snapshot.docs[0].data();
      return res.status(200).json({
          message: 'Data successfully grabbed.',
          data,
      })
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
      message: 'Please add valid captain value to parameter.'
    })
  }
  return res;
};

/**
 * putTeam - meant to be used to add data to existing team documents, make sure to use a POST request if creating a new team
 */
const putTeam = (req: functions.Request, res: functions.Response) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Please make request with team data. No data found in request body.'
    });
  }
  if (!req.body.captain) {
    return res.status(400).json({
      message: 'Team id not found in request body. Make sure to clarify id in request body.',
    });
  }
  const captain = req.body.captain;
  db.doc(captain).set(req.body, { merge: true, })
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
};

/**
 * postTeam - POST endpoint used to create new team document
 */
const postTeam = (req: functions.Request, res: functions.Response) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Please make request with team data. No data found in request body.'
    });
  }
  if(!checkNewTeamData(req.body)) {
    return res.status(400).json({
      message: 'Make sure request body includes a captain, name, type (tent type), and number (tent number) elements.',
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
};

/**
 * team - API endpoint that takes GET, PUT, and POST requests to the team collection
 */
const team = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET': {
      return getTeam(req, res);
    }
    case 'PUT': {
      return putTeam(req, res);
    }
    case 'POST': {
      return postTeam(req, res);
    }
    default: {
      return res.status(400).json({
        message: 'HTTPS method not recognized and/or supported.',
      })
    }
  }
});

export {
  team,
};
