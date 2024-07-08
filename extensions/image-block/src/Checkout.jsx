import {
  Banner,  
  reactExtension,
  Image,
  useSettings,
  Style,
  View,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const { image_url_d, image_url_m, alt } = useSettings();

  return (
    // <Image source={ image_url } accessibilityDescription={ alt } />
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