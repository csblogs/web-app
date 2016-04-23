import moment from 'moment';

export function truncateAndRemoveHTML(str, maxLength) {
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
  } catch (error) {
    return '';
  }
}

export function formatDateLong(datestamp) {
  try {
    const date = moment(datestamp);
    return date.format('MMMM D, YYYY h:mm a');
  } catch (error) {
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

export function add(strNum1, strNum2) {
  const number1 = parseInt(strNum1, 10);
  const number2 = parseInt(strNum2, 10);

  if (isNaN(number1) || isNaN(number2)) {
    return '';
  }
  return number1 + number2;
}
