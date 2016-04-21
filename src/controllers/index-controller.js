import * as api from '../helpers/api';

const PAGE_SIZE = 10;

export function getAllPosts(pageNumber) {
  return api.get('posts', {
    page: pageNumber,
    page_size: PAGE_SIZE
  });
}

export function getPostAuthors(posts) {
  // Use a set to store IDs uniquely
  const ids = new Set();

  // Add posts author IDs to set
  for (let i = 0; i < posts.length; ++i) {
    ids.add(posts[i].author_id);
  }

  // Stringify as CSV
  const idsParams = Array.from(ids).join(',');

  return api.get('users', {
    ids: idsParams
  })
  .then(users => {
    // Store as hash with author_id as key
    /* eslint-disable no-param-reassign */
    const authors = users.reduce((map, user) => {
      map[user.id] = {
        first_name: user.first_name,
        last_name: user.last_name,
        vanity_name: user.vanity_name,
        profile_picture_uri: user.profile_picture_uri
      };
      return map;
    }, {});
    /* eslint-enable no-param-reassign */

    return { authors, posts };
  });
}
