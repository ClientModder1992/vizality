const getCreationDate = (id) => {
  const EPOCH = 1420070400000;

  return new Date((id / 4194304) + EPOCH).toLocaleString();
};

module.exports = getCreationDate;
