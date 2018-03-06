const { https } = require("firebase-functions");
const setupExpressServer = require("./server");

const server = setupExpressServer();

exports.api = https.onRequest(server);
