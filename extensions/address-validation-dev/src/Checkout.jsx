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

const FIELD_LIMITS = {
  address1: 40,
  address2: 40,
  company: 40,
  city: 20,
};

function Extension() {

  const translate = useTranslate();
  const shippingAddress = useShippingAddress();
  const canBlockProgress = useExtensionCapability('block_progress');
  console.log('canBlockProgress', canBlockProgress);

  const blockingErrors = [];

  for (const [fieldName, limit] of Object.entries(FIELD_LIMITS)) {

    const fieldValue = shippingAddress?.[fieldName];

    if (!fieldValue) {
      continue;
    }

    if (fieldValue.length > limit) {

      const blockingError = {
        message: `${ translate(`${ fieldName }IsTooLong`) } ${ fieldValue.length }/${ limit }`,
        // Show an error underneath the specific address field
        target: `$.cart.deliveryGroups[0].deliveryAddress.${ fieldName }`,
      };

      blockingErrors.push(blockingError);
    }
  }

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress && blockingErrors?.length) {
      console.log('block');
      return {
        behavior: 'block',
        reason: translate('tooLongErrorMessage'),
        errors: [
          ...blockingErrors,
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