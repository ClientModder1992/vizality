const isUrl = (url) => {
  try {
    new URL(url);
  } catch (err) {
    return false;
  }

  return true;
};

module.exports = isUrl;
