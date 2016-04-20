import * as api from '../helpers/api';
import log from '../log';

export function test() {
  api.get('/posts', { author_id: 54 })
    .then(body => {
      log.info(body);
      log.info(body[0].date_updated);
    })
    .catch(err => {
      log.info(err);
    });
}
