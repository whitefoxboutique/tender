import {
  Banner,
  reactExtension,
  useCustomer,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

function Extension() {
  const customer = useCustomer();
  console.log('customer', customer);

  return (
    <Banner title="loyalty-points-summary">
      { JSON.stringify(customer) }
    </Banner>
  );
}