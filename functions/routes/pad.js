const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

var db = admin.firestore();
var collection = db.collection('pad');


// Get a pad by id
router.get('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var padRef = collection.doc(req.params.id);
  var getDoc = padRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Pad not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      responseJson.code = 200;
      responseJson.message = 'Pad successfully found.';
      responseJson.data = doc.data();
      res.json(responseJson);
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get pad: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Create a Pad
router.post('/', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var body = req.body;

  var data = JSON.parse(JSON.stringify(body));
  delete data['id'];

  var padRef = collection.doc(body.id);
  var getDoc = padRef.get().then(doc => {
    if (!doc.exists) {
      var setDoc = collection.doc(body.id).set(data).then(ref => {
        responseJson.code = 201;
        responseJson.message = 'Pad successfully created.';
        responseJson.data = body;
        res.json(responseJson);
        return responseJson.message;
      }).catch(err => {
        responseJson.code = 500;
        responseJson.message = 'Could not create pad: ' + err;
        res.json(responseJson);
        return responseJson.message;
      });
      return responseJson.message;
    } else {
      responseJson.code = 409;
      responseJson.message = 'Pad already exists.';
      res.json(responseJson);
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get existing pad to validate: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Delete a pad
router.delete('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": ''
  }

  var padRef = collection.doc(req.params.id);
  var getDoc = padRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Pad not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      var deleteDoc = userRef.delete().then(ref => {
        responseJson.code = 200;
        responseJson.message = 'Pad successfully deleted.';
        res.json(responseJson);
        return responseJson.message;
      }).catch(err => {
        responseJson.code = 404;
        responseJson.message = 'Could not delete pad: ' + err;
        res.json(responseJson);
        return responseJson.message;
      });
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get pad to delete: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Update a pad
router.put('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var data = JSON.parse(JSON.stringify(req.body));
  delete data['id'];

  var padRef = collection.doc(req.params.id);
  var updateDoc = padRef.update(data).then(ref => {
    responseJson.code = 200;
    responseJson.message = 'Pad successfully updated.';
    responseJson.data = data;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not update pad: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


module.exports = router;
