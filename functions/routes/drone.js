const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

var db = admin.firestore();
var collection = db.collection('drone');


// Get all drones
router.get('/', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": []
  }

  var getDoc = collection.get().then(snapshot => {
      var docs = [];
      snapshot.forEach(doc => {
        data = doc.data();
        data["id"] = doc.id;
        docs.push(data);
      });
      responseJson.code = 200;
      responseJson.message = 'Drones successfully found.';
      responseJson.data = docs;
      res.json(responseJson);
      return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get drones: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Get a drone by id
router.get('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var droneRef = collection.doc(req.params.id);
  var getDoc = droneRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Drone not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      responseJson.code = 200;
      responseJson.message = 'Drone successfully found.';
      responseJson.data = doc.data();
      res.json(responseJson);
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get drone: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Create a Drone
router.post('/', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var body = req.body;

  var setDoc = collection.add(body).then(ref => {
    responseJson.code = 201;
    responseJson.message = 'Drone successfully created.';
    body["id"] = ref.id;
    responseJson.data = body;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not create drone: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Delete a drone
router.delete('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": ''
  }

  var droneRef = collection.doc(req.params.id);
  var getDoc = droneRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Drone not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      var deleteDoc = droneRef.delete().then(ref => {
        responseJson.code = 200;
        responseJson.message = 'Drone successfully deleted.';
        res.json(responseJson);
        return responseJson.message;
      }).catch(err => {
        responseJson.code = 404;
        responseJson.message = 'Could not delete drone: ' + err;
        res.json(responseJson);
        throw new Error(responseJson.message);
      });
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get drone to delete: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Update a drone
router.put('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var data = JSON.parse(JSON.stringify(req.body));
  delete data['id'];

  var droneRef = collection.doc(req.params.id);
  var updateDoc = droneRef.update(data).then(ref => {
    responseJson.code = 200;
    responseJson.message = 'Drone successfully updated.';
    responseJson.data = data;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not update drone: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


module.exports = router;
