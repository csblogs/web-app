import moment from 'moment';

export function truncate(str, maxLength) {
  if (str.length > maxLength) {
    const newStr = str.substring(0, maxLength);
    return `${newStr.trim()}&hellip;`;
  }
  return str;
}

export function formatDateShort(datestamp) {
  try {
    const date = moment(datestamp);

    if (moment().diff(date, 'days') > 6) {
      return date.format('MMM D, YYYY');
    }
    return date.fromNow();
  } catch (err) {
    return '';
  }
}

export function formatDateLong(datestamp) {
  try {
    const date = moment(datestamp);
    return date.format('MMMM D, YYYY h:mm a');
  } catch (err) {
    return '';
  }
}

export function urlFormat(urlStr) {
  let url = urlStr || '';

  try {
    if (url.startsWith('http://')) {
      url = url.substring(7);
    } else if (url.startsWith('https://')) {
      url = url.substring(8);
    }

    if (url.startsWith('www.')) {
      url = url.substring(4);
    }

    return url;
  } catch (err) {
    return url;
  }
}

export function section(name, options) {
  if (!this._sections) {
    this._sections = {};
  }
  this._sections[name] = options.fn(this);
  return null;
}

export function add(strNum1, strNum2) {
  const number1 = parseInt(strNum1, 10);
  const number2 = parseInt(strNum2, 10);

  if (isNaN(number1) || isNaN(number2)) {
    return '';
  }
  return number1 + number2;
}

export function svg(name) {
  return `/public/images/defs-069a8abc47.svg#${name}`;
}

export function ifInvalid(errors, name) {
  if (errors) {
    for (let i = 0; i < errors.length; ++i) {
      if (errors[i].parameter === name) {
        return 'class="invalid"';
      }
    }
  }
  return '';
}
