import {
  reactExtension,
  useExtensionCapability,
} from '@shopify/ui-extensions-react/checkout';

// 1. Choose an extension target
export default reactExtension('purchase.checkout.delivery-address.render-before', () => (
  <Extension />
));

function Extension() {
  const canBlockProgress = useExtensionCapability('block_progress');

  if (canBlockProgress) {
    return {
      behavior: 'block',
      reason: `Just don't like u`,
      errors: [
        {
          message: `I think I'm just tired.`,
        },
      ],
    };  
  }
  
  return;
}