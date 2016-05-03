import * as api from '../helpers/api';

const PAGE_SIZE = 16;

export function getAllBloggers(pageNumber) {
  return api.get('users', {
    page: pageNumber - 1,
    page_size: PAGE_SIZE
  });
}

export function getSingleBlogger(vanityName) {
  return api.get('users', {
    vanity_name: vanityName
  });
}

export function getLoggedInBlogger(token) {
  return api.getAuth('users/me', token);
}

export function getPageSize() {
  return PAGE_SIZE;
}
