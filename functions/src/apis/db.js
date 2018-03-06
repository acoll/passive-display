const functions = require("firebase-functions");
var admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

module.exports = admin.database();
