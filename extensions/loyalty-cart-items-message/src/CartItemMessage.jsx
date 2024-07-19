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

const { getAdjustedPointsTotal } = require('../../../utils_loyalty');

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

  // console.log(metafields, adjustedPointsTotal, lineFactor, linePoints);

  if (!linePoints) {
    return;
    // return <SkeletonText inlineSize="large"></SkeletonText>;
  }

  let loggedOutMessage;
  try {
    loggedOutMessage = translate('logged_out_cart_item_message', { points: linePoints });
  } catch(err) {
    loggedOutMessage = translate('logged_out_cart_item_message');
  }

  let loggedInMessage;
  try {
    loggedInMessage = translate('logged_in_cart_item_message', { points: linePoints });
  } catch(err) {
    loggedInMessage = translate('logged_in_cart_item_message');
  }

  try {

    if (!customer) {
      return (
        <Text size="small">
          { loggedOutMessage }
        </Text>
      );
    }

    return (
      <Text size="small">
        { loggedInMessage }
      </Text>
    );

  } catch(err) {
    console.log(err);
  }

  return;
}