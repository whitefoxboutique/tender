import {
  reactExtension,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useShippingAddress,
  useTranslate,
} from '@shopify/ui-extensions-react/checkout';

// 1. Choose an extension target
export default reactExtension('purchase.checkout.delivery-address.render-before', () => (
  <Extension />
));

function Extension() {

  const translate = useTranslate();

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
        reason: translate('tooLongErrorMessage'),
        errors: [
          {
            message: `${ translate('address1IsTooLong') } ${ address1.length }/40`,
            // Show an error underneath the country code field
            target: '$.cart.deliveryGroups[0].deliveryAddress.address1',
          },
          {
            // In addition, show an error at the page level
            message: translate('tooLongErrorMessage'),
          },
        ],
      };
    }
  });
  
  console.log(`Don't block`);
  return;
}