const gidToId = (gid) => {
  try {
    return gid.split('/').pop();
  } catch(err) {
    console.error(err);
  }
  return false;
};

const arraySum = (arr, { pathToNumber } = {}) => {
  if (pathToNumber) {
    const pathNodes = pathToNumber.split('.');
      
    return arr.reduce((total, item) => {
      const number = pathNodes.reduce((acc, part) => acc?.[part], obj);
      return total + number;
    }, 0);
  }
  
  return arr.reduce((total, item) => {
    return total + item;
  }, 0);
};

module.exports = {
  gidToId,
  arraySum,
};