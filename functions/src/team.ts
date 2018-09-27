import * as functions from 'firebase-functions';
import { parse } from 'querystring';

import { firebase } from './../config';

const db = firebase.firestore().collection('teams')

/**
 * checkNewTeamData - helper function for postTeam to check if new team data is valid
 */
const checkNewTeamData = (data) => (data.id && data.name && data.type && data.number);

/**
 * getTeam - gets data from team document with required id parameter
 */
const getTeam = (req: functions.Request, res: functions.Response) => {
  const params = parse(req.url.split('?')[1])
  if (params.id) {
    const id = params.id;
    db.where('captain', '==', id).get()
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
 * putTeam - meant to be used to add data to existing team documents, make sure to use a POST request if creating a new team
 */
const putTeam = (req: functions.Request, res: functions.Response) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Please make request with team data. No data found in request body.'
    });
  }
  if (!req.body.id) {
    return res.status(400).json({
      message: 'Team id not found. Make sure to clarify captain as the team id in request body.',
    });
  }
  const id = req.body.id; // id of the user that is the captain is the id of the team in the collection
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
  if (!req.body.id) {
    return res.status(400).json({
      message: 'Team id not found. Make sure to clarify captain as the team id in request body.',
    });
  }
  if(!checkNewTeamData(req.body)) {
    return res.status(400).json({
      message: 'Make sure request body includes a id, name, type (tent type), and number (tent number) elements.',
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
