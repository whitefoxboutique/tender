import {
  reactExtension,
  useCartLines,
  useApi,
  Link,
} from "@shopify/ui-extensions-react/checkout";

import { useEffect, useState } from 'react';

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

  const { query } = useApi();
  const cartLines = useCartLines();
  const [handles, setHandles] = useState([]);
  const [permalink, setPermalink] = useState({});

  useEffect(() => {
    async function fetchStorefrontData() {
      const responses = await Promise.all(cartLines.map(l => query(
        `query ($productId: ID!) {
          product(id: $productId) {
            handle
          }
        }`,
        {
          variables: {
            productId: l.merchandise.product.id,
          },
        },
      )));

      const handles = responses.map(r => r?.data?.product?.handle);

      setHandles(handles);

      const cartPermalink = Object.fromEntries(cartLines.map((line, i) => {
        const { quantity } = line;
        const handle = handles[i];
        return [handle, quantity];
      }));

      setPermalink(cartPermalink);
    }

    if (cartLines.length > 0) {
      fetchStorefrontData();
    }
  }, [cartLines, query]);

   useEffect(() => {
    console.log('Updated handles:', handles, permalink);
  }, [handles]); // This effect runs whenever handles changes

  const permalinkParam = {
    permalink: Object.entries(permalink).map(([handle, quantity]) => `${ handle }:${ quantity }`).join(','),
  };

  return (
    <>
      { SWITCHER_OPTIONS.map(option => {
        const { name, domain, params = {} } = option;
        const paramsWithCart = { ...params, ...permalinkParam };
        const url = `https://${ domain }?${ new URLSearchParams(paramsWithCart).toString() }`;
        return <Link to={ url }>{ name }</Link>;
      }) }
    </>
  );
}