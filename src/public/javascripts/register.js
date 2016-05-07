/* eslint-env jquery */

$(document).ready(() => {
  const inputs = $('input[type=text], input[type=email], input[type=url], textarea');

  // Add active on focus
  inputs.on('focus', (e) => {
    $(e.currentTarget).siblings('label').addClass('active');
  });

  // Remove active on blur
  inputs.on('blur', (e) => {
    const target = $(e.currentTarget);

    if (target.val().length === 0 && target.attr('placeholder') === undefined) {
      target.siblings('label').removeClass('active');
    }
  });

  // Add active if form auto-completes
  inputs.on('change', (e) => {
    const target = $(e.currentTarget);

    if (target.val().length !== 0 || target.attr('placeholder') !== undefined) {
      target.siblings('label').addClass('active');
    }
  });

  // Add active if pre-populated
  inputs.each((index, element) => {
    const target = $(element);

    if (target.val().length > 0 || target.attr('placeholder') !== undefined) {
      target.siblings('label').addClass('active');
    } else {
      target.siblings('label').removeClass('active');
    }
  });

  function resizeTextarea(element, offset) {
    $(element).css('height', '2.4em').css('height', element.scrollHeight + offset);
  }

  // Resize textareas automatically
  // http://stephanwagner.me/auto-resizing-textarea
  $('textarea[autoresize]').each((index, element) => {
    const offset = element.offsetHeight - element.clientHeight;

    $(element).on('keyup input', (e) => {
      resizeTextarea(e.currentTarget, offset);
    }).removeAttr('autoresize');

    resizeTextarea(element, offset);
  });
});
