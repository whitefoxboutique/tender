import {
  reactExtension,
  Link,
} from "@shopify/ui-extensions-react/checkout";

const SWITCHER_OPTIONS = [
  {
    name: 'AUS & NZ',
    domain: 'whitefoxboutique.com.au',
  },
  {
    name: 'USA, CAD, MEX',
    domain: 'whitefoxboutique.com',
  },
  {
    name: 'EUROPE & UAE',
    domain: 'whitefoxboutique.co.uk',
    params: { currency: 'EUR' },
  },
  {
    name: 'UK',
    domain: 'whitefoxboutique.co.uk',
    params: { currency: 'GBP' },
  },
  {
    name: 'REST OF THE WORLD',
    domain: 'whitefoxboutique.com.au',
  },
];

// 1. Choose an extension target
export default reactExtension('purchase.checkout.footer.render-after', () => (
  <Extension />
));

function Extension() {
  return (
    <>
      { SWITCHER_OPTIONS.map(option => {
        const { name, domain, params } = option;
        const url = `https://${ domain }${ params ? new URLSearchParams(params).toString() : '' }`;
        return <Link to={ url }>{ name }</Link>;
      }) }
    </>
  );
}