import {
  Banner,
  Text,
  reactExtension,
  useCustomer,
  Link,
  useShop,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

function Extension() {
  const customer = useCustomer();
  const shop = useShop();

  console.log('customer', customer);
  console.log('shop', shop);

  const { storefrontUrl } = shop;
  const loginLink = `${ storefrontUrl }/account/login`;

  const pointsTotal = 100;

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