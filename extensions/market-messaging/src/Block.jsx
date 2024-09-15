import {
  Banner,
  reactExtension,
  useSettings,
  useLocalizationMarket,
  Image,
  Style,
  View,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {

  const { 
    title, 
    message, 
    status,
    size,
    alignment,

    image_url_d,
    image_url_m,
    alt,

    show_markets, 
    hide_markets,
  } = useSettings();

  const market = useLocalizationMarket();
  const { handle: marketHandle } = market;
  console.log('marketHandle', marketHandle);

  /* Markets show logic */
  // console.log(show_markets, hide_markets);

  let show = true;

  if (show_markets) {
    const showMarkets = show_markets.split(',');
    if (!showMarkets.includes(marketHandle)) {
      show = false;
    }
  }

  if (hide_markets) {
    const hideMarkets = hide_markets.split(',');
    if (!hideMarkets.includes(marketHandle)) {
      show = false;
    }
  }

  if (!show) {
    return;
  }

  // Decide which block to show by whether an image is set.
  if (!image_url_d) {
    return (
      <Banner title={ title } status={ status } size={ size } inlineAlignment={ alignment }>
        { message }
      </Banner>
    );
  }

  return (
    <View>
      <View
        maxInlineSize={
          Style.default('fill')
            .when({ viewportInlineSize: { min: 'medium' } }, '0')
        }
      >
        <Image 
          source={ image_url_d }
          accessibilityDescription={ alt } 
        />
      </View>
      <View
        maxInlineSize={
          Style.default('0')
            .when({ viewportInlineSize: { min: 'medium' } }, 'fill')
        }
      >
        <Image 
          source={ image_url_m }
          accessibilityDescription={ alt } 
        />
      </View>
    </View>
  );
}