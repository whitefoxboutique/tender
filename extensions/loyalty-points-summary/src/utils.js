const { gidToId, arraySum } = require('../../../utils');

// These params should be straight from the API, no funny business.
const getPointsTotal = (metafields, cartLines) => {
  const pointsMetafields = metafields.filter(mf => {
    const { target, metafield } = mf;
    const { type } = target;
    const { namespace, key } = metafield;
    return type === 'variant' && namespace == 'loyalty' && key === 'points';
  });

  const variantIdToPointsMap = pointsMetafields.reduce((map, mf) => {
    const { target, metafield } = mf;
    const { id } = target;
    const { value } = metafield;
    map[id] = value;
    return map;
  }, {});

  const pointsTotal = arraySum(cartLines.map(line => {
    const variantGid = line?.merchandise?.id;
    const variantId = gidToId(variantGid);

    const { quantity } = line;

    const itemPoints = variantIdToPointsMap[variantId];
    if (!itemPoints) {
      return null;
    }

    const linePoints = itemPoints * quantity;
    return linePoints;
  }).filter(item => item));

  return pointsTotal;
};

module.exports = {
  getPointsTotal,
};