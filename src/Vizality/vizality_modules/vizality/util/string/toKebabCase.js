const toKebabCase = (string) => {
  if (!string) return '';

  let from = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž';
  let to = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';

  from += from.toUpperCase();
  to += to.toUpperCase();

  to = to.split('');

  // for tokens requiring multitoken output
  from += 'ß';
  to.push('ss');

  return String(string)
    .trim()
    .replace(/.{1}/g, c => {
      const index = from.indexOf(c);
      return index === -1 ? c : to[index];
    })
    .replace(/[^\w\s-]/g, '-').toLowerCase()
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-').toLowerCase();
};

module.exports = toKebabCase;
