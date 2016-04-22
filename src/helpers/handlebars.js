import moment from 'moment';

export function truncateAndRemoveHTML(string, length) {
  // return BlogController.truncateAndRemoveHTML(string, length);
  // Temporary:
  return string.substring(0, length);
}

export function formatDateShort(datestamp) {
  try {
    const date = moment(datestamp);

    if (moment().diff(date, 'days') > 6) {
      return date.format('MMM D, YYYY');
    }
    return date.fromNow();
  }
  catch (error) {
    return '';
  }
}

export function formatDateLong(datestamp) {
  try {
    const date = moment(datestamp);
    return date.format('MMMM D, YYYY h:mm a');
  }
  catch (error) {
    return '';
  }
}

export function section(name, options) {
  if (!this._sections) {
    this._sections = {};
  }
  this._sections[name] = options.fn(this);
  return null;
}
