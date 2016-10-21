import * as api from '../helpers/api';

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

  for (const key of Object.keys(fields)) {
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

export function registerUser(user) {
  user.profilePictureURI = 'http://image.com/'; // eslint-disable-line no-param-reassign

  return api.post('user', user)
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
