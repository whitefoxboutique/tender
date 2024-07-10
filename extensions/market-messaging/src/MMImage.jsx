import { 
  reactExtension,
  Image,
  useSettings,
  Style,
  View,
  useLocalizationMarket,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const { image_url_d, image_url_m, alt, show_markets, hide_markets } = useSettings();

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