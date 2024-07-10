const gidToId = (gid) => {
  try {
    return gid.split('/').pop();
  } catch(err) {
    console.error(err);
  }
  return false;
};

const arraySum = (arr) => {
  return arr.reduce((total, item) => {
    return total + item;
  }, 0);
};

module.exports = {
  gidToId,
  arraySum,
};