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