import * as api from '../helpers/api';
import * as blogController from '../controllers/blog-controller';

export const PAGE_SIZE = 16;

const fieldMap = {
  firstName: 'First Name',
  lastName: 'Last Name',
  emailAddress: 'Email Address',
  profilePictureURI: 'Avatar URL',
  vanityName: 'Vanity Name',
  bio: 'Bio',
  websiteURI: 'Website URL',
  blogURI: 'Blog Website URL',
  blogFeedURI: 'Blog Feed URL',
  cvURI: 'CV URL',
  linkedInURI: 'LinkedIn URL',
  githubUsername: 'GitHub Name',
  twitterUsername: 'Twitter Name'
};

function assignFriendlyFieldNames(fields) {
  const friendlyFields = {};
  const keys = Object.keys(fields);

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];

    friendlyFields[key] = {};
    friendlyFields[key].name = fieldMap[key];
    friendlyFields[key].message = fields[key];
  }

  return friendlyFields;
}

export function getAllBloggers(pageNumber) {
  return api.get('user', {
    page: pageNumber - 1,
    page_size: PAGE_SIZE
  });
}

export function getSingleBlogger(vanityName) {
  return api.get('user', {
    vanity_name: vanityName
  });
}

export function getLoggedInBlogger(token) {
  return api.getAuth('user/me', token);
}

export function registerUser(user, token) {
  return api.postAuth('user', user, token)
    .then(data => {
      if (data.status === 201) {
        return data;
      }

      return {
        status: data.status,
        errors: assignFriendlyFieldNames(data.validationErrors)
      };
    });
}

export function updateUser(user, token) {
  return api.putAuth('user/me', user, token)
    .then(data => {
      if (data.status === 200) {
        return data;
      }

      const error = data;

      if (error.name !== 'UniqueConstraintError' && error.validationErrors.vanityName) {
        error.validationErrors.vanityName =
          `should only contain lowercase a-z, 0-9, and hyphens
           (no more than one hyphen consecutively) and must not
           start or end with a hyphen`;
      }

      return {
        status: error.status,
        errors: assignFriendlyFieldNames(error.validationErrors)
      };
    });
}

export function deleteUser(token) {
  return api.deleteAuth('user/me', null, token);
}

export async function renderProfile(req, res, loggedIn) {
  const pageNumber = req.query.page || 1;

  const blogger = loggedIn ?
    await getLoggedInBlogger(req.user.apiToken) :
    await getSingleBlogger(req.params.vanity_name);

  const posts = await blogController.getBloggerPosts(blogger.id, pageNumber);
  const hasMore = posts.length === blogController.PAGE_SIZE;
  const hasLess = pageNumber > 1;

  res.render('profile', {
    title: `${blogger.firstName} ${blogger.lastName}`,
    loggedIn,
    blogger,
    posts,
    pageNumber,
    hasMore,
    hasLess
  });
}
