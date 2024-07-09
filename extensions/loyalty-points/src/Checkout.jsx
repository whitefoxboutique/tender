import {
  Banner,
  useApi,
  useAppMetafields,
  reactExtension,
  useTarget,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const metafields = useAppMetafields();
  console.log(metafields);

  const targetInfo = useTarget();

  return (
    <Banner title="loyalty-points">
      { JSON.stringify(targetInfo) }
    </Banner>
  );
}