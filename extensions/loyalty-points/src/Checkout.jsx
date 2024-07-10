import {
  useApi,
  useAppMetafields,
  reactExtension,
  useTarget,
  Text,
  SkeletonText,
  useTotalAmount,
  useSubtotalAmount,
  useTotalShippingAmount,
  useCartLines,
  useDiscountAllocations,
  useDiscountCodes,
  useAppliedGiftCards,
} from '@shopify/ui-extensions-react/checkout';

import * as allImported from '@shopify/ui-extensions-react/checkout';

const { gidToId } = require('../../../utils');

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {






  // console.log('NMAKWLDN', allImported);


  // console.log('useTarget', useTarget());
  // console.log('useTotalAmount', useTotalAmount());
  // console.log('useSubtotalAmount', useSubtotalAmount());
  // console.log('useTotalShippingAmount', useTotalShippingAmount());
  // console.log('useCartLines', useCartLines());
  // console.log('useDiscountAllocations', useDiscountAllocations());
  // console.log('useDiscountCodes', useDiscountCodes());
  // console.log('useAppliedGiftCards', useAppliedGiftCards());

  const totalAmount = useTotalAmount();
  const subtotalAmount = useSubtotalAmount();
  const totalShippingAmount = useTotalShippingAmount();
  const cartLines = useCartLines();
  const discountAllocations = useDiscountAllocations();
  const discountCodes = useDiscountCodes();
  const appliedGiftCards = useAppliedGiftCards();

  const discountsTotal = discountAllocations.reduce((total, da) => total + parseInt(da?.discountedAmount?.amount), 0);
  // const giftCardsTotal = appliedGiftCards.reduce((total, agc) => total + parseInt(da?.discountedAmount?.amount), 0);

  const calculatedSpend = subtotalAmount?.amount - totalShippingAmount?.amount - discountsTotal;
  // console.log(calculatedSpend, totalAmount?.amount);

  const metafields = useAppMetafields();
  // console.log(metafields);

  const targetInfo = useTarget();
  const { merchandise } = targetInfo;
  const { id: variantGid } = merchandise;
  const variantId = gidToId(variantGid);

  // console.log('variantId', variantId);

  const variantLoyaltyPointsMetafield = metafields.find(mf => {
    const { target, metafield } = mf;
    const { type, id } = target;
    return type === 'variant' && id === variantId;
  })?.metafield;

  // console.log('variantLoyaltyPointsMetafield', variantLoyaltyPointsMetafield);
  const { value: itemPoints } = variantLoyaltyPointsMetafield || {};

  if (!itemPoints) {
    return;
    // return <SkeletonText inlineSize="large"></SkeletonText>;
  }


  const itemPrice = targetInfo?.cost?.totalAmount?.amount / targetInfo?.quantity;
  // console.log('itemPrice', itemPrice);

  const giftCardsTotal = appliedGiftCards.reduce((total, gc) => total + gc?.amountUsed?.amount, 0);
  // console.log('giftCardsTotal', giftCardsTotal);
  
  const itemsSubtotal = cartLines.reduce((total, line) => total + line?.cost?.totalAmount?.amount, 0) - giftCardsTotal;
  // console.log('itemsSubtotal', itemsSubtotal);

  const spendFactor = itemsSubtotal / subtotalAmount?.amount;
  // console.log('spendFactor', spendFactor);
  const adjustedPoints = spendFactor * itemPoints;

  return (
    <Text>
      Earning { Math.floor(adjustedPoints) } points!
    </Text>
  );
}