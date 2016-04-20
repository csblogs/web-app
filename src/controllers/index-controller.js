import * as api from '../helpers/api';
import log from '../log';

const PAGE_SIZE = 10;

export function getAllPosts(pageNumber) {
  api.get('/posts', {
    page: pageNumber,
    page_size: PAGE_SIZE
  })
  .then(body => {
    log.info(body);
  })
  .catch(err => {
    log.info(err);
  });
}
