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

const getAdjustedPointsTotal = (metafields, cartLines, appliedGiftCards, totalAmount, subtotalAmount) => { // , shippingTotalAmount
  const pointsTotal = getPointsTotal(metafields, cartLines);

  const giftCardsTotal = arraySum(appliedGiftCards, { pathToNumber: 'amountUsed.amount' });

  const spend = totalAmount?.amount - giftCardsTotal;

  const linesDiscountTotal = arraySum(cartLines.map(line => {
    const { discountAllocations } = line;
    return arraySum(discountAllocations, { pathToNumber: 'discountedAmount.amount' });
  }));
  const pointsEarningOriginalTotal = subtotalAmount?.amount + linesDiscountTotal; // + shippingTotalAmount?.amount;

  const factor = spend / pointsEarningOriginalTotal;
  const adjustedPointsTotal = Math.floor(pointsTotal * factor);

  return adjustedPointsTotal;
};

module.exports = {
  getPointsTotal,
  getAdjustedPointsTotal,
};