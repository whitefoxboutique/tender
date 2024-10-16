import {
  reactExtension,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from '@shopify/ui-extensions-react/checkout';

// 1. Choose an extension target
export default reactExtension('purchase.checkout.delivery-address.render-before', () => (
  <Extension />
));

function Extension() {
  const canBlockProgress = useExtensionCapability('block_progress');

  console.log('canBlockProgress', canBlockProgress);

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress) {
      console.log('block');
      return {
        behavior: 'block',
        reason: `Just don't like u`,
        errors: [
          {
            message: `I think I'm just tired`,
            // Show an error underneath the country code field
            target: '$.cart.deliveryGroups[0].deliveryAddress.countryCode',
          },
          {
            // In addition, show an error at the page level
            message: `I don't like the cut of your jib.`,
          },
        ],
      };
    }
  });
  
  console.log(`Don't block`);
  return;
}