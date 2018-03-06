const express = require("express");
const cors = require("cors");
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const schema = require("./graph/schema");

module.exports = function setupExpressServer() {
  const app = express();

  app.use(function(req, res, next) {
    req.userId = req.headers.auth;
    next();
  });

  app.use(cors());

  app.use(
    "/graph",
    graphqlExpress(req => ({ schema, context: req, tracing: true }))
  );
  app.use(
    "/graphiql",
    graphiqlExpress({
      endpointURL: `graph`
    })
  );

  return app;
};
