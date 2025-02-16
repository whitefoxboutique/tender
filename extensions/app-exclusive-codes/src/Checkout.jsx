import {
  reactExtension,
  useApplyDiscountCodeChange,
  useDiscountCodes,
  useTranslate,
  useAttributeValues,
  Banner,
  Text,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

import { useEffect, useState, useMemo } from "react";

export default reactExtension("purchase.checkout.reductions.render-before", () => (
  <Extension />
));

function Extension() {
  const applyDiscountCodeChange = useApplyDiscountCodeChange();
  const discountCodes = useDiscountCodes();
  const [{ hasRemovedCode, removedCode }, setDiscountState] = useState({
    hasRemovedCode: false,
    removedCode: null,
  });
  const [tapcartId] = useAttributeValues(["tapcart_id"]);
  const translate = useTranslate();
  const { discount_codes } = useSettings();

  if (tapcartId) return null;

  const uniqueCodes = useMemo(() => 
    new Set(
      discount_codes
        .split('\n')
        .map(code => code.trim())
        .filter(Boolean)
    ),
    [discount_codes]
  );

  useEffect(() => {
    const removeInvalidDiscountCodes = async () => {
      if (discountCodes.length === 0) {
        setDiscountState({ hasRemovedCode: false, removedCode: null });
        return;
      }

      const invalidCode = discountCodes.find(({ code }) => uniqueCodes.has(code));
      
      if (invalidCode) {
        await applyDiscountCodeChange({
          code: invalidCode.code,
          type: "removeDiscountCode",
        });
        
        setDiscountState({
          hasRemovedCode: true,
          removedCode: invalidCode.code,
        });
      }
    };

    removeInvalidDiscountCodes();
  }, [discountCodes]);

  if (!hasRemovedCode || !removedCode) return null;

  return (
    <Banner title={translate("error_title")} status="critical">
      <Text>
        {translate("error_description", { code: removedCode })}
      </Text>
    </Banner>
  );
}