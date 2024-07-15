import {
  useTranslate,
  Banner,
  Text,
  reactExtension,
  useCustomer,
  Link,
  useShop,
  useAppMetafields,
  useCartLines,
  List,
  ListItem,
  SkeletonText,
  useTotalAmount,
  useSubtotalAmount,
  useTotalShippingAmount,
  useAppliedGiftCards,
} from '@shopify/ui-extensions-react/checkout';

const { getAdjustedPointsTotal } = require('./utils');

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();

  const customer = useCustomer();
  const shop = useShop();
  const metafields = useAppMetafields();
  const cartLines = useCartLines();
  const totalAmount = useTotalAmount();
  const subtotalAmount = useSubtotalAmount();
  const shippingTotalAmount = useTotalShippingAmount();
  const appliedGiftCards = useAppliedGiftCards();

  const { storefrontUrl } = shop;
  const loginLink = `${ storefrontUrl }/account/login`;

  const adjustedPointsTotal = getAdjustedPointsTotal(metafields, cartLines, appliedGiftCards, totalAmount, subtotalAmount); // , shippingTotalAmount

  // const debug = (
  //   <Banner title="Debug">
  //     <List>
  //       <ListItem>We need to get points total * (spend / subtotal)</ListItem>
  //       <ListItem>points total: sum of line items loyalty points metafield [+ points for shipping (not gettable)]</ListItem>
  //       <ListItem>{ pointsTotal }</ListItem>
  //       <ListItem>spend: total - gift card allocation</ListItem>
  //       <ListItem>{ spend }</ListItem>
  //       <ListItem>subtotal: subtotal + shipping</ListItem>
  //       <ListItem>{ pointsEarningOriginalTotal }</ListItem>
  //       <ListItem>Final points</ListItem>
  //       <ListItem>{ adjustedPointsTotal }</ListItem>
  //     </List>
  //   </Banner>
  // );

  const loginLinkEl = <Link to={ loginLink } appearance="monochrome">{ translate('log_in') }</Link>;

  console.log('adjustedPointsTotal', adjustedPointsTotal);
  if (!adjustedPointsTotal) {
    return;
  }

  let loggedOutMessage;
  try {
    loggedOutMessage = translate('logged_out_message', { points: adjustedPointsTotal, log_in: loginLinkEl });
  } catch(err) {
    loggedOutMessage = translate('logged_out_message', { log_in: loginLinkEl });
  }

  let loggedInMessage;
  try {
    loggedInMessage = translate('logged_in_message', { points: adjustedPointsTotal });
  } catch(err) {
    loggedInMessage = translate('logged_in_message');
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