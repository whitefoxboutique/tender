import {
  Banner,  
  reactExtension,
  Image,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const { image_url, alt } = useSettings();

  return (
    <Image source={ image_url } accessibilityDescription={ alt } />
  );
}