import request from 'request';
import log from '../log';

const BASE_URL = 'https://newapi.csblogs.com/v2.0/';

export function get(url, params, auth) {
  return new Promise((resolve, reject) => {
    request.get({
      baseUrl: BASE_URL,
      url,
      auth,
      qs: params,
      json: true
    },
    (err, res, body) => {
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
    });
  });
}
