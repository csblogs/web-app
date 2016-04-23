import request from 'request';
import log from '../log';

const BASE_URL = 'https://newapi.csblogs.com/v2.0/';

export function get(url, params) {
  return new Promise((resolve, reject) => {
    request.get({
      baseUrl: BASE_URL,
      url,
      qs: params,
      json: true
    },
    (err, res, body) => {
      if (err) {
        log.error(url, err);
        return reject(err);
      } else if (res.statusCode !== 200) {
        // Try to get error from JSON response
        const errorMessage = body.error || `Unexpected status code: ${res.statusCode}`;
        const error = new Error(errorMessage);

        error.status = res.statusCode;
        error.res = res;
        log.error(url, error);

        return reject(error);
      }
      return resolve(body);
    });
  });
}
