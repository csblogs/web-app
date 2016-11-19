import request from 'request';
import log from '../log';

const BASE_URL = `${process.env.API_BASE_URL}/v2.0/`;

function handleGetResponse(url, resolve, reject, err, res, body) {
  if (err) {
    log.error({ url, err }, 'Error from API request');
    return reject(err);
  } else if (res.statusCode !== 200) {
    // Try to get error from JSON response
    const errorMessage = body.error || `Unexpected status code: ${res.statusCode}`;
    const error = new Error(errorMessage);

    error.status = res.statusCode;

    log.error({ url, res }, errorMessage);
    return reject(error);
  }
  return resolve(body);
}

function handlePostResponse(url, resolve, reject, err, res, body) {
  if (err) {
    log.error({ url, err }, 'Error from API request');
    return reject(err);
  }
  const data = body;
  data.status = res.statusCode;

  return resolve(data);
}

export function get(url, params, auth) {
  return new Promise((resolve, reject) => {
    request.get({
      baseUrl: BASE_URL,
      url,
      auth,
      qs: params,
      json: true
    },
    (err, res, body) =>
      handleGetResponse(url, resolve, reject, err, res, body)
    );
  });
}

export function getAuth(url, token) {
  return new Promise((resolve, reject) => {
    request.get({
      baseUrl: BASE_URL,
      url,
      headers: {
        Authorization: token
      },
      json: true
    },
    (err, res, body) =>
      handleGetResponse(url, resolve, reject, err, res, body)
    );
  });
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    request.post({
      baseUrl: BASE_URL,
      url,
      body: data,
      json: true
    },
    (err, res, body) =>
      handlePostResponse(url, resolve, reject, err, res, body)
    );
  });
}

export function postAuth(url, data, token) {
  return new Promise((resolve, reject) => {
    request.get({
      baseUrl: BASE_URL,
      url,
      headers: {
        Authorization: `JWT ${token}`
      },
      body: data,
      json: true
    },
    (err, res, body) =>
      handleGetResponse(url, resolve, reject, err, res, body)
    );
  });
}
