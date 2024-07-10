import {
  useTranslate,
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
  useCustomer,
} from '@shopify/ui-extensions-react/checkout';

// import * as allImported from '@shopify/ui-extensions-react/checkout';

const { getAdjustedPointsTotal } = require('./utils');

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {

  const translate = useTranslate();

  const metafields = useAppMetafields();
  const cartLines = useCartLines();
  const totalAmount = useTotalAmount();
  const subtotalAmount = useSubtotalAmount();
  const shippingTotalAmount = useTotalShippingAmount();
  const appliedGiftCards = useAppliedGiftCards();
  const customer = useCustomer();

  const adjustedPointsTotal = getAdjustedPointsTotal(metafields, cartLines, appliedGiftCards, totalAmount, subtotalAmount); // , shippingTotalAmount

  const target = useTarget();
  const linePrice = target?.cost?.totalAmount?.amount;
  const lineFactor = linePrice / totalAmount?.amount;
  // console.log('lineFactor', lineFactor);
  const linePoints = Math.floor(adjustedPointsTotal * lineFactor);

  if (!linePoints) {
    return;
    // return <SkeletonText inlineSize="large"></SkeletonText>;
  }

  if (!customer) {
    return (
      <Text>
        { translate('logged_out_cart_item_message', { points: linePoints }) }
      </Text>
    );
  }

  return (
    <Text>
      { translate('logged_in_cart_item_message', { points: linePoints }) }
    </Text>
  );
}