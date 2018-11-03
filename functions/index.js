const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const app = express();

admin.initializeApp(functions.config().firebase);

app.use('/user', require('./routes/user.js'));
app.use('/order', require('./routes/order.js'));
app.use('/pad', require('./routes/pad.js'));
app.use('/datapoint', require('./routes/datapoint.js'));

exports.app = functions.https.onRequest(app);
