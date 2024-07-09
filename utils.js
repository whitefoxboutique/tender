const gidToId = (gid) => {
  try {
    return gid.split('/').pop();
  } catch(err) {
    console.error(err);
  }
  return false;
};

module.exports = {
  gidToId,
};