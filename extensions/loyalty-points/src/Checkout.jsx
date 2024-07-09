import {
  useApi,
  useAppMetafields,
  reactExtension,
  useTarget,
  Text,
} from '@shopify/ui-extensions-react/checkout';

const { gidToId } = require('../../../utils');

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const metafields = useAppMetafields();
  console.log(metafields);

  const targetInfo = useTarget();
  const { merchandise } = targetInfo;
  const { id: variantGid } = merchandise;
  const variantId = gidToId(variantGid);

  console.log('variantId', variantId);

  const variantLoyaltyPointsMetafield = metafields.find(mf => {
    const { target, metafield } = mf;
    const { type, id } = target;
    return type === 'variant' && id === variantId;
  })?.metafield;

  console.log('variantLoyaltyPointsMetafield', variantLoyaltyPointsMetafield);
  // const { value } = variantLoyaltyPointsMetafield;

  return (
    <Text>
      Earning points!
    </Text>
  );
}