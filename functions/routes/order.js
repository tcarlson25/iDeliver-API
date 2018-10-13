const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

var db = admin.firestore();
var collection = db.collection('order');


// Get all orders
router.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  var responseJson = {
    "code": 0,
    "message": '',
    "data": []
  }

  var getDoc = collection.get().then(snapshot => {
      var docs = [];
      snapshot.forEach(doc => {
        order = doc.data();
        order["id"] = doc.id;
        docs.push(order);
      });
      responseJson.code = 200;
      responseJson.message = 'Orders successfully found.';
      responseJson.data = docs;
      res.json(responseJson);
      return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get orders: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Get an order by id
router.get('/:id', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var orderRef = collection.doc(req.params.id);
  var getDoc = orderRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Order not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      responseJson.code = 200;
      responseJson.message = 'Order successfully found.';
      responseJson.data = doc.data();
      res.json(responseJson);
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get order: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Create an Order
router.post('/', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var body = req.body;

  var setDoc = collection.add(body).then(ref => {
    responseJson.code = 201;
    responseJson.message = 'Order successfully created.';
    body["id"] = ref.id;
    responseJson.data = body;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not create order: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Delete an Order
router.delete('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": ''
  }

  var orderRef = collection.doc(req.params.id);
  var getDoc = orderRef.get().then(doc => {
    if (!doc.exists) {
      responseJson.code = 404;
      responseJson.message = 'Order not found.';
      res.json(responseJson);
      return responseJson.message;
    } else {
      var deleteDoc = orderRef.delete().then(ref => {
        responseJson.code = 200;
        responseJson.message = 'Order successfully deleted.';
        res.json(responseJson);
        return responseJson.message;
      }).catch(err => {
        responseJson.code = 404;
        responseJson.message = 'Could not delete order: ' + err;
        res.json(responseJson);
        throw new Error(responseJson.message);
      });
      return responseJson.message;
    }
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not get order to delete: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


// Update an order
router.put('/:id', (req, res) => {
  var responseJson = {
    "code": 0,
    "message": '',
    "data": {}
  }

  var data = JSON.parse(JSON.stringify(req.body));
  delete data['id'];

  var orderRef = collection.doc(req.params.id);
  var updateDoc = orderRef.update(data).then(ref => {
    responseJson.code = 200;
    responseJson.message = 'Order successfully updated.';
    responseJson.data = data;
    res.json(responseJson);
    return responseJson.message;
  }).catch(err => {
    responseJson.code = 500;
    responseJson.message = 'Could not update order: ' + err;
    res.json(responseJson);
    return responseJson.message;
  });
});


module.exports = router;
