import {
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

const { gidToId } = require('../../../utils');

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

function Extension() {
  const customer = useCustomer();
  const shop = useShop();
  const metafields = useAppMetafields();
  const cartLines = useCartLines();
  const total = useTotalAmount();
  const subtotal = useSubtotalAmount();
  const shippingTotal = useTotalShippingAmount();
  const appliedGiftCards = useAppliedGiftCards();

  const { storefrontUrl } = shop;
  const loginLink = `${ storefrontUrl }/account/login`;

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

  const pointsTotal = cartLines.reduce((total, line) => {
    const variantGid = line?.merchandise?.id;
    const variantId = gidToId(variantGid);

    const { quantity } = line;

    const itemPoints = variantIdToPointsMap[variantId];
    if (!itemPoints) {
      return total;
    }

    const linePoints = itemPoints * quantity;
    return total + linePoints;
  }, 0);

  const giftCardsTotal = appliedGiftCards.reduce((total, gc) => total + gc?.amountUsed?.amount, 0);

  const spend = total?.amount - giftCardsTotal;

  const linesDiscountTotal = cartLines.reduce((total, line) => {
    const { discountAllocations } = line;

    const lineDiscountsTotal = discountAllocations.reduce((totalDiscount, discount) => {
      const { discountedAmount } = discount;
      return totalDiscount + discountedAmount?.amount;
    }, 0);

    return total + lineDiscountsTotal;
  }, 0);
  const pointsEarningOriginalTotal = subtotal?.amount + linesDiscountTotal; // + shippingTotal?.amount;

  const factor = spend / pointsEarningOriginalTotal;
  const adjustedPointsTotal = Math.floor(pointsTotal * factor);

  const debug = (
    <Banner title="Debug">
      <List>
        <ListItem>We need to get points total * (spend / subtotal)</ListItem>
        <ListItem>points total: sum of line items loyalty points metafield [+ points for shipping (not gettable)]</ListItem>
        <ListItem>{ pointsTotal }</ListItem>
        <ListItem>spend: total - gift card allocation</ListItem>
        <ListItem>{ spend }</ListItem>
        <ListItem>subtotal: subtotal + shipping</ListItem>
        <ListItem>{ pointsEarningOriginalTotal }</ListItem>
        <ListItem>Final points</ListItem>
        <ListItem>{ adjustedPointsTotal }</ListItem>
      </List>
    </Banner>
  );

  if (!customer) {
    return (
      <Text>
        <Link to={ loginLink }>Log in</Link> to earn { adjustedPointsTotal } points on this order!
      </Text>
    );
  }

  return (
    <Text>
      You're earning { adjustedPointsTotal } points on this order!
    </Text>
  );
}