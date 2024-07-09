import {
  Banner,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.reductions.render-before',
  () => <Extension />,
);

function Extension() {
  return (
    <Banner title="loyalty-points-summary">
      You get points
    </Banner>
  );
}