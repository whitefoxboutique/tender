import {
  reactExtension,
  useApi,
  ConsentCheckbox,
  ConsentPhoneField,
  Banner,
} from '@shopify/ui-extensions-react/checkout';

// 1. Choose an extension target
export default reactExtension('purchase.checkout.contact.render-after', () => (
  <Extension />
));

function Extension() {

  const { buyerIdentity } = useApi();
  console.log('buyerIdentity', buyerIdentity);

  return (
    <Banner>Hey
      <ConsentCheckbox policy="sms-marketing">
        Text me with news and offers
      </ConsentCheckbox>
      <ConsentPhoneField label="Phone" policy="sms-marketing" autocomplete="true">
      </ConsentPhoneField>
    </Banner>
  );  


  // // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  // if (!instructions.attributes.canUpdateAttributes) {
  //   // For checkouts such as draft order invoices, cart attributes may not be allowed
  //   // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
  //   return (
  //     <Banner title="Custom SMS Consent" status="warning">
  //       {translate("attributeChangesAreNotSupported")}
  //     </Banner>
  //   );
  // }

  // // 3. Render a UI
  // return (
  //   <BlockStack border={"dotted"} padding={"tight"}>
  //     <Banner title="Custom SMS Consent">
  //       {translate("welcome", {
  //         target: <Text emphasis="italic">{extension.target}</Text>,
  //       })}
  //     </Banner>
  //     <Checkbox onChange={onCheckboxChange}>
  //       {translate("iWouldLikeAFreeGiftWithMyOrder")}
  //     </Checkbox>
  //   </BlockStack>
  // );

  // async function onCheckboxChange(isChecked) {
  //   // 4. Call the API to modify checkout
  //   const result = await applyAttributeChange({
  //     key: "requestedFreeGift",
  //     type: "updateAttribute",
  //     value: isChecked ? "yes" : "no",
  //   });
  //   console.log("applyAttributeChange result", result);
  // }
}