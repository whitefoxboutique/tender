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

  if (!customer) {
    return (
      <Text>
        <Link to={ loginLink }>Log in</Link> to earn { pointsTotal } points on this order!
      </Text>
    );
  }

  return (
    <Banner title="loyalty-points-summary">
      { JSON.stringify(customer) }
    </Banner>
  );
}