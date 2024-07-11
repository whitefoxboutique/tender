import {
  reactExtension,
  Banner,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.delivery-address.render-after", () => (
  <Extension />
));

function Extension() {
  return (
    <Banner>Hixxxx</Banner>
  );
}