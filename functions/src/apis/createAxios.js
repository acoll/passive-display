const axios = require("axios");

const captureStartTime = config => {
  config.requestStartedAt = Date.now();
  return config;
};

const responseLoggerSuccess = response => {
  console.log(
    Date.now() - response.config.requestStartedAt,
    response.status,
    response.statusText,
    response.config.url
  );
  return response;
};

const responseLoggerFailure = error => {
  responseLoggerSuccess(error);
  return Promise.reject(error);
};

function createAxios(config) {
  const instance = axios.create(config);
  instance.interceptors.request.use(captureStartTime);
  instance.interceptors.response.use(
    responseLoggerSuccess,
    responseLoggerFailure
  );
  return instance;
}

module.exports = { createAxios };
