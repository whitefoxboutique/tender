import {
  reactExtension,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useShippingAddress,
} from '@shopify/ui-extensions-react/checkout';

// 1. Choose an extension target
export default reactExtension('purchase.checkout.delivery-address.render-before', () => (
  <Extension />
));

function Extension() {

  const shippingAddress = useShippingAddress();
  const { address1 } = shippingAddress;
  const address1IsTooLong = address1.length > 40;

  const canBlockProgress = useExtensionCapability('block_progress');

  console.log('canBlockProgress', canBlockProgress);

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress && address1IsTooLong) {
      console.log('block');
      return {
        behavior: 'block',
        reason: `Address1 cannot be longer than 40 characters.`,
        errors: [
          {
            message: `Please use 40 characters or less. ${ address1.length }/40`,
            // Show an error underneath the country code field
            target: '$.cart.deliveryGroups[0].deliveryAddress.address1',
          },
          {
            // In addition, show an error at the page level
            message: `Our shipping company has max character limits - please edit your address.`,
          },
        ],
      };
    }
  });
  
  console.log(`Don't block`);
  return;
}