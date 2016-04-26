import * as api from '../helpers/api';

const PAGE_SIZE = 10;

export function getAllPosts(pageNumber) {
  return api.get('posts', {
    page: pageNumber - 1,
    page_size: PAGE_SIZE
  });
}

export function getBloggerPosts(bloggerId, pageNumber) {
  return api.get('posts', {
    author_id: bloggerId,
    page: pageNumber - 1,
    page_size: PAGE_SIZE
  });
}

export function getPostAuthors(posts) {
  // Add posts author IDs to array
  const ids = posts.map(post => post.author_id);

  // Stringify as CSV
  const idsParams = ids.join(',');

  return api.get('users', {
    ids: idsParams
  })
  .then(users => {
    // Return author as a property of each post
    const postsWithAuthors = posts;

    for (let i = 0; i < posts.length; ++i) {
      postsWithAuthors[i].author = users[posts[i].author_id];
    }
    return postsWithAuthors;
  });
}

export function getPageSize() {
  return PAGE_SIZE;
}
