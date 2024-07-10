import {
  Banner,
  Text,
  reactExtension,
  useCustomer,
  Link,
  useShop,
  useAppMetafields,
  useCartLines,
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

  console.log('customer', customer);
  console.log('shop', shop);

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

  console.log('variantIdToPointsMap', variantIdToPointsMap);

  const pointsTotal = cartLines.reduce((total, line) => {
    const variantGid = line?.merchandise?.id;
    const variantId = gidToId(variantGid);

    const { quantity } = line;

    const points = variantIdToPointsMap[variantId] * quantity;
    return total + points;
  }, 0);

  console.log('pointsTotal', pointsTotal);

  const debug = (
    <Banner>
      Debug
      We need to get points total * (spend / subtotal)
      points total: sum of line items loyalty points metafield
      spend: total - gift card allocation
      subtotal: as-is, hopefully it's a good indication of original line items total + shipping
    </Banner>
  );

  if (!customer) {
    return (
      <Text>
        { debug }
        <Link to={ loginLink }>Log in</Link> to earn { pointsTotal } points on this order!
      </Text>
    );
  }

  return (
    <Text>
      { debug }
      You're earning { pointsTotal } points on this order!
    </Text>
  );
}