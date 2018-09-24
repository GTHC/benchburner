import * as functions from 'firebase-functions';
import { parse } from 'querystring';

import { firebase } from './../config';

const db = firebase.firestore().collection('teams')

const getTeam = (req, res) => (null);

const putTeam = (req, res) => (null);

const team = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET': {
      return getTeam(req, res);
    }
    case 'PUT': {
      return putTeam(req, res);
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
