const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

var db = admin.firestore();
var collection = db.collection('user');


// Get a user by id (username)
router.get('/:id', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var userRef = collection.doc(req.params.id);
  var getDoc = userRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'User not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      responseJson.code = 200;
      responseJson.message = 'User successfully found.';
      responseJson.data = doc.data();
      res.json(responseJson);
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get user: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Create a User
router.post('/', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var body = req.body;
  body['pad_id'] = null;

  var data = JSON.parse(JSON.stringify(body));
  delete data['id'];

  var userRef = collection.doc(body.id);
  var getDoc = userRef.get().then(doc => {
    if (!doc.exists) {
      var setDoc = collection.doc(body.id).set(data).then(ref => {
        responseJson.code = 201;
        responseJson.message = 'User successfully created.';
        responseJson.data = body;
        res.json(responseJson);
        return responseJson.message;
      }).catch(err => {
        responseJson.code = 500;
        responseJson.message = 'Could not create user: ' + err;
        res.json(responseJson);
        return responseJson.message;
      });
      return responseJson.message;
    } else {
      responseJson.code = 409;
      responseJson.message = 'User already exists.';
      res.json(responseJson);
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get existing user to validate: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Delete a user
router.delete('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": ''
  }

  var userRef = collection.doc(req.params.id);
  var getDoc = userRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'User not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      var deleteDoc = userRef.delete().then(ref => {
        responseJson.code = 200;
        responseJson.message = 'User successfully deleted.';
        res.json(responseJson);
        return responseJson.message;
      }).catch(err => {
        responseJson.code = 404;
        responseJson.message = 'Could not delete user: ' + err;
        res.json(responseJson);
        return responseJson.message;
      });
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get user to delete: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Update a user
router.put('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var data = JSON.parse(JSON.stringify(req.body));
  delete data['id'];

  var userRef = collection.doc(req.params.id);
  var updateDoc = userRef.update(data).then(ref => {
    responseJson.code = 200;
    responseJson.message = 'User successfully updated.';
    responseJson.data = data;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not update user: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


module.exports = router;
