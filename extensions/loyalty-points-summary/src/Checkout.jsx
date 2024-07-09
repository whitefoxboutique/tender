import {
  Banner,
  Text,
  reactExtension,
  useCustomer,
  Link,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

function Extension() {
  const customer = useCustomer();
  console.log('customer', customer);

  const pointsTotal = 100;

  if (!customer) {
    return (
      <Text>
        <Link to="/account/login">Log in</Link> to earn { pointsTotal } points on this order!
      </Text>
    );
  }

  return (
    <Banner title="loyalty-points-summary">
      { JSON.stringify(customer) }
    </Banner>
  );
}