import URI from 'urijs';

export function getFullName(displayName, userAsBlogger) {
  const blogger = userAsBlogger;

  // Check displayName for first/last name combinations
  if (displayName.includes(' ')) {
    const name = displayName.split(' ');
    blogger.firstName = name.shift();
    blogger.lastName = name.join(' ');
  } else {
    blogger.firstName = displayName;
  }

  return blogger;
}

export function normalizeVanityName(name) {
  return name
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '');
}

// Clamp minimum Gravatar size
export function resizeGravatar(avatarURI) {
  const uri = new URI(avatarURI);

  try {
    if (uri.domain() === 'gravatar.com') {
      if (parseInt(uri.search(true).s, 10) < 500) {
        uri.setQuery('s', 500);

        return uri.toString();
      }
    }
  } catch (e) {
    // Return avatarURI instead
  }

  return avatarURI;
}
