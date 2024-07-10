import {
  reactExtension,
  Text,
  SkeletonText,
  useAppMetafields,
  useCartLines,
  useTotalAmount,
  useSubtotalAmount,
  useTotalShippingAmount,
  useAppliedGiftCards,
  useTarget,
} from '@shopify/ui-extensions-react/checkout';

// import * as allImported from '@shopify/ui-extensions-react/checkout';

const { getAdjustedPointsTotal } = require('./utils');

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {

  const metafields = useAppMetafields();
  const cartLines = useCartLines();
  const totalAmount = useTotalAmount();
  const subtotalAmount = useSubtotalAmount();
  const shippingTotalAmount = useTotalShippingAmount();
  const appliedGiftCards = useAppliedGiftCards();

  const adjustedPointsTotal = getAdjustedPointsTotal(metafields, cartLines, appliedGiftCards, totalAmount, subtotalAmount); // , shippingTotalAmount

  const target = useTarget();
  const linePrice = target?.cost?.totalAmount?.amount;
  const lineFactor = linePrice / totalAmount?.amount;
  console.log('lineFactor', lineFactor);
  const linePoints = Math.floor(adjustedPointsTotal * lineFactor);

  if (!linePoints) {
    return;
    // return <SkeletonText inlineSize="large"></SkeletonText>;
  }

  return (
    <Text>
      Earning { linePoints } points!
    </Text>
  );
}