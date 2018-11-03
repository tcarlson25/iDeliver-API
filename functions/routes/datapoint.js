const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

var db = admin.firestore();
var collection = db.collection('datapoint');


// Get all data points
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
      responseJson.message = 'Data points successfully found.';
      responseJson.data = docs;
      res.json(responseJson);
      return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get data points: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Get a data point by id
router.get('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var dataRef = collection.doc(req.params.id);
  var getDoc = dataRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Data point not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      responseJson.code = 200;
      responseJson.message = 'Data point successfully found.';
      responseJson.data = doc.data();
      res.json(responseJson);
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get data point: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});





// Create a Data Point
router.post('/', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var body = req.body;

  var setDoc = collection.add(body).then(ref => {
    responseJson.code = 201;
    responseJson.message = 'Data point successfully created.';
    body["id"] = ref.id;
    responseJson.data = body;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not create data point: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Delete a data point
router.delete('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": ''
  }

  var dataRef = collection.doc(req.params.id);
  var getDoc = dataRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Data point not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      var deleteDoc = dataRef.delete().then(ref => {
        responseJson.code = 200;
        responseJson.message = 'Data point successfully deleted.';
        res.json(responseJson);
        return responseJson.message;
      }).catch(err => {
        responseJson.code = 404;
        responseJson.message = 'Could not delete data point: ' + err;
        res.json(responseJson);
        throw new Error(responseJson.message);
      });
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get data point to delete: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Update a data point
router.put('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var data = JSON.parse(JSON.stringify(req.body));
  delete data['id'];

  var dataRef = collection.doc(req.params.id);
  var updateDoc = dataRef.update(data).then(ref => {
    responseJson.code = 200;
    responseJson.message = 'Data point successfully updated.';
    responseJson.data = data;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not update data point: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


module.exports = router;
