import {
  reactExtension,
  Banner,
  useShippingAddress,
} from "@shopify/ui-extensions-react/checkout";

import * as allImported from '@shopify/ui-extensions-react/checkout';

// 1. Choose an extension target
export default reactExtension("purchase.checkout.delivery-address.render-after", () => (
  <Extension />
));

function Extension() {
  console.log('allImported', allImported);

  const shippingAddress = useShippingAddress();

  const { address1 } = shippingAddress;
  
  // console.log('address1', address1);

  if (!address1) {
    // hasn't been entered yet
    return;
  }

  const startsWithANumberRegex = /^\d/;
  if (!startsWithANumberRegex.test(address1)) {
    return (
      <Banner>Hey babe, do you need to enter a house number?</Banner>
    );
  }

  return;
}