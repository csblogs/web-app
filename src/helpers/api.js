import request from 'request';

const BASE_URL = `${process.env.API_BASE_URL}/v2.0/`;
const API_ERROR_MESSAGE = 'Unexpected error from API request';

function handleGetResponse(url, resolve, reject, err, res, body) {
  if (err) {
    return reject(err);
  } else if (res.statusCode !== 200) {
    // Try to get error from JSON response
    const errorMessage = body.error || API_ERROR_MESSAGE;
    const error = new Error(errorMessage);
    error.status = res.statusCode;

    return reject(error);
  }
  return resolve(body);
}

function handlePostResponse(url, resolve, reject, err, res, body) {
  if (err) {
    return reject(err);
  }
  const data = body;
  data.status = res.statusCode;

  return resolve(data);
}

export function get(url, params) {
  return new Promise((resolve, reject) => {
    request.get({
      baseUrl: BASE_URL,
      url,
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
        Authorization: `JWT ${token}`
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
    request.post({
      baseUrl: BASE_URL,
      url,
      headers: {
        Authorization: `JWT ${token}`
      },
      body: data,
      json: true
    },
    (err, res, body) =>
      handlePostResponse(url, resolve, reject, err, res, body)
    );
  });
}

export function putAuth(url, data, token) {
  return new Promise((resolve, reject) => {
    request.put({
      baseUrl: BASE_URL,
      url,
      headers: {
        Authorization: `JWT ${token}`
      },
      body: data,
      json: true
    },
    (err, res, body) =>
      handlePostResponse(url, resolve, reject, err, res, body)
    );
  });
}

export function deleteAuth(url, data, token) {
  return new Promise((resolve, reject) => {
    request.delete({
      baseUrl: BASE_URL,
      url,
      headers: {
        Authorization: `JWT ${token}`
      },
      body: data,
      json: true
    },
    (err, res, body) =>
      handlePostResponse(url, resolve, reject, err, res, body)
    );
  });
}
