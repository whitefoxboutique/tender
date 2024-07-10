import {
  Banner,
  reactExtension,
  useSettings,
  useLocalizationMarket,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {

  const { 
    title, 
    text, 
    show_markets, 
    hide_markets,
    status,
  } = useSettings();
  const market = useLocalizationMarket();
  console.log(market);
  const { handle: marketHandle } = market;

  let show = true;

  console.log(show_markets, hide_markets);

  if (show_markets && !show_markets.includes(marketHandle)) {
    show = false;
  }

  if (hide_markets && hide_markets.includes(marketHandle)) {
    show = false;
  }

  if (!show) {
    return;
  }

  return (
    <Banner title={ title } status={ status }>
      { text }
    </Banner>
  );
}