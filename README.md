# benchburner 🔥🔥🔥
GTHC's (Game Tenting Help Center) API which creates endpoints with Google Cloud's Cloud Functions for Firebase 🔥.

## Contents
1. [/user](https://github.com/GTHC/benchburner/blob/master/README.md#user)
2. [/team](https://github.com/GTHC/benchburner/blob/master/README.md#team)
3. [/shifts](https://github.com/GTHC/benchburner/blob/master/README.md#shifts)
4. [/shift](https://github.com/GTHC/benchburner/blob/master/README.md#shift)

## API Endpoints

### `/user`
#### GET - gets a users documents data using the id specified in the id parameter of the URL
##### Example Response Body
`GET http://us-central1-gthc-kville.cloudfunctions.net/user?id=amanmibra@gmail.com`

Output: 
```
{
    "message": "Data successfully grabbed.",
    "data": {
        "createdAt": "2018-09-23T04:18:17.457Z",
        "displayName": "Aman Ibrahim",
        "email": "amanmibra@gmail.com",
        "id": "amanmibra@gmail.com",
        "isCaptain": true,
        "isFirstSignIn": true,
        "lastSignIn": "2018-09-23T04:18:17.457Z",
        "name": "Aman Ibrahim",
        "photo": "https://lh5.googleusercontent.com/-6spmS-s24is/AAAAAAAAAAI/AAAAAAAANRI/KyNLiyt_po0/photo.jpg",
        "photoURL": "https://lh5.googleusercontent.com/-6spmS-s24is/AAAAAAAAAAI/AAAAAAAANRI/KyNLiyt_po0/photo.jpg",
        "team": {
            "captain": "amanmibra@gmail.com",
            "name": "Tent 1",
            "number": 1,
            "type": "Black"
        },
        "test": "tests"
    }
}
```

#### PUT - adds data to existing documents under 'users' collection
##### PUT Request Body Example
```
{
  id: amanmibra@gmail.com, // it must be the email of the user, as that is its identifier [REQUIRED]
  test: "test value", // one can add new value and it will be appended to the user document
  isCaptain: false, // or they can replace existing fields within a document without replace and changing any other fields
}
```

#### PUT Response Body Example
`PUT http://us-central1-gthc-kville.cloudfunctions.net/user` (use example body above in this request)
```
{
    "message": "Put is successful.",
    "data": {
        "createdAt": "2018-09-23T04:18:17.457Z",
        "email": "amanmibra@gmail.com",
        "id": "amanmibra@gmail.com",
        "isCaptain": false,
        "isFirstSignIn": true,
        "lastSignIn": "2018-09-23T04:18:17.457Z",
        "name": "Aman Ibrahim",
        "photoURL": "https://lh5.googleusercontent.com/-6spmS-s24is/AAAAAAAAAAI/AAAAAAAANRI/KyNLiyt_po0/photo.jpg",
        "team": {
            "captain": "amanmibra@gmail.com",
            "name": "Tent 1",
            "number": 1,
            "type": "Black"
        },
        "test": "test value"
    }
}
```

### `/team`
#### GET - gets data from team document with required captain parameter
##### Example Response Body
`GET http://us-central1-gthc-kville.cloudfunctions.net/team?captain=amanmibra@gmail.com`
```
{
    "message": "Data successfully grabbed.",
    "data": {
        "captain": "amanmibra@gmail.com",
        "id": "amanmibra@gmail.com",
        "name": "Tent 1",
        "number": "1",
        "type": "Black"
    }
}
```

#### PUT - meant to be used to add data to existing team documents, make sure to use a POST request if creating a new team
##### Example Request Body
`PUT https://us-central1-gthc-kville.cloudfunctions.net/team`
```
{
  captain: "amanmibra@gmail.com", // for teams, the identifier is the captain value [REQUIRED]
  test: "test value"
}
```
##### Example Response Body
```
{
    "message": "Put is successful."
}
```

Note: There will be an update that will include the new team data after calling PUT, just like `PUT /USER`.

### POST - create new team
#### Example Request Body
```
{
  name: "Team Jacob",
  type: "Dirty Black",
  number: 42,
  captain: "jacob@gmail.com",
 }
 ```
 
 Note: `name`, `type`, `number`, and `captain` fields are all REQUIRED, otherwise, add any other fields as you wish. (At the moment those are the only required fields, but a field for passcode will be required eventually in the near future.)
 #### Example Response Body
 ```
 {
    "message": "Post is successful."
}
```

Note: Just like the `PUT /team` request, there will more information added to the response time

### `/shifts`
#### GET -  GET shifts of an entire team with a captain parameter
##### Example Request Body
`PUT - https://us-central1-gthc-kville.cloudfunctions.net/shifts?captain=amanmibra@gmail.com`
```
{
    "message": "Data successfully grabbed.",
    "data": [
        {
            "id": "3W0ZoJHSXD9WmeAcUJk8",
            "captain": "amanmibra@gmail.com",
            "endTime": "test",
            "startTime": "test",
            "users": [
                "amanmibra@gmail.com"
            ]
        },
        ...
    ]
}
```

### `/shift`
#### GET - GET an individual shift with id parameter
##### Example Request Body
`GET - https://us-central1-gthc-kville.cloudfunctions.net/shift?id=3IgcGpynvKaxaACIxQOY`
```
{
    "message": "Data successfully grabbed.",
    "data": {
        "id": "3IgcGpynvKaxaACIxQOY",
        "captain": "amanmibra",
        "endTime": "tes",
        "startTime": "tes",
        "users": [
            "amanmibra@gmail.com"
        ]
    }
}
```

#### PUT - PUT data into existing shifts
##### Example Request Body
`PUT - /shift`
```
{
  id: "3IgcGpynvKaxaACIxQOY", // this is the identfier, so this is [REQUIRED]
  test: "test value",
 }
 ```
 #### Example Response Body
 ```
 {
    "message": "Put is successful."
}
```

#### POST - create new shift
##### Example Request Body
```
{
  captain: "amanmibra@gmail.com",
  startTime: DateObject,
  endTime: DateObject,
  users: [], // array of users identified by email/id
}
```

Note: At the moment, the `captain`, `startTime`, `endTime`, and `users` fields are all REQUIRED.

##### Example Response Body
```
{
    "message": "Post is successful."
}
```

Note: This will be updated to include shift data.
