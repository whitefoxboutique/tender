import {
  reactExtension,
  useCartLines,
  useApi,
  Link,
  Image,
  InlineLayout,
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
  const [permalinkItems, setPermalinkItems] = useState([]);

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

      console.log('cartLines', cartLines);

      const cartPermalinkItems = cartLines.map((line, i) => {
        const { quantity, merchandise } = line;
        const { selectedOptions } = merchandise;
        const handle = handles[i];
        return {
          handle, 
          quantity,
          selectedOptions,
        };
      });

      setPermalinkItems(cartPermalinkItems);
    }

    if (cartLines.length > 0) {
      fetchStorefrontData();
    }
  }, [cartLines, query]);

   useEffect(() => {
    console.log('Updated handles:', handles, permalinkItems);
  }, [handles]); // This effect runs whenever handles changes

  const cartString = permalinkItems.map(({ handle, quantity, selectedOptions }) => `${ handle }:${ JSON.stringify(selectedOptions) }:${ quantity }`).join(',');
  const encodedCart = btoa(cartString);
  const permalinkParam = {
    permalink: encodedCart,
  };

  // atob(decodeURIComponent('dGhlLXZpZGVvZ3JhcGhlci1zbm93Ym9hcmQ6W3sibmFtZSI6IlRpdGxlIiwidmFsdWUiOiJEZWZhdWx0IFRpdGxlIn1dOjE%3D'));

  return (
    <InlineLayout blockAlignment="center">
      { SWITCHER_OPTIONS.map(option => {
        const { name, domain, params = {} } = option;
        const paramsWithCart = { ...params, ...permalinkParam };
        const url = `https://${ domain }?${ new URLSearchParams(paramsWithCart).toString() }`;
        return <Link key={ name } to={ url }>
          <Image source="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBzdHlsZT0iZmlsbDogcmdiKDI0MCwgMjQwLCAyNDApOyI+PC9jaXJjbGU+PGc+PHBhdGggZD0iTTUyLjkyLDEwMC4xNDJjLTIwLjEwOSwyNi4xNjMtMzUuMjcyLDU2LjMxOC00NC4xMDEsODkuMDc3aDEzMy4xNzhMNTIuOTIsMTAwLjE0MnoiIHN0eWxlPSJmaWxsOiByZ2IoMCwgODIsIDE4MCk7Ij48L3BhdGg+PHBhdGggZD0iTTUwMy4xODEsMTg5LjIxOWMtOC44MjktMzIuNzU4LTIzLjk5My02Mi45MTMtNDQuMTAxLTg5LjA3NmwtODkuMDc1LDg5LjA3Nkg1MDMuMTgxeiIgc3R5bGU9ImZpbGw6IHJnYigwLCA4MiwgMTgwKTsiPjwvcGF0aD48cGF0aCBkPSJNOC44MTksMzIyLjc4NGM4LjgzLDMyLjc1OCwyMy45OTMsNjIuOTEzLDQ0LjEwMSw4OS4wNzVsODkuMDc0LTg5LjA3NUw4LjgxOSwzMjIuNzg0TDguODE5LDMyMi43ODR6IiBzdHlsZT0iZmlsbDogcmdiKDAsIDgyLCAxODApOyI+PC9wYXRoPjxwYXRoIGQ9Ik00MTEuODU4LDUyLjkyMWMtMjYuMTYzLTIwLjEwOS01Ni4zMTctMzUuMjcyLTg5LjA3Ni00NC4xMDJ2MTMzLjE3N0w0MTEuODU4LDUyLjkyMXoiIHN0eWxlPSJmaWxsOiByZ2IoMCwgODIsIDE4MCk7Ij48L3BhdGg+PHBhdGggZD0iTTEwMC4xNDIsNDU5LjA3OWMyNi4xNjMsMjAuMTA5LDU2LjMxOCwzNS4yNzIsODkuMDc2LDQ0LjEwMlYzNzAuMDA1TDEwMC4xNDIsNDU5LjA3OXoiIHN0eWxlPSJmaWxsOiByZ2IoMCwgODIsIDE4MCk7Ij48L3BhdGg+PHBhdGggZD0iTTE4OS4yMTcsOC44MTljLTMyLjc1OCw4LjgzLTYyLjkxMywyMy45OTMtODkuMDc1LDQ0LjEwMWw4OS4wNzUsODkuMDc1VjguODE5eiIgc3R5bGU9ImZpbGw6IHJnYigwLCA4MiwgMTgwKTsiPjwvcGF0aD48cGF0aCBkPSJNMzIyLjc4Myw1MDMuMTgxYzMyLjc1OC04LjgzLDYyLjkxMy0yMy45OTMsODkuMDc1LTQ0LjEwMWwtODkuMDc1LTg5LjA3NVY1MDMuMTgxeiIgc3R5bGU9ImZpbGw6IHJnYigwLCA4MiwgMTgwKTsiPjwvcGF0aD48cGF0aCBkPSJNMzcwLjAwNSwzMjIuNzg0bDg5LjA3NSw4OS4wNzZjMjAuMTA4LTI2LjE2MiwzNS4yNzItNTYuMzE4LDQ0LjEwMS04OS4wNzZIMzcwLjAwNXoiIHN0eWxlPSJmaWxsOiByZ2IoMCwgODIsIDE4MCk7Ij48L3BhdGg+PC9nPjxnPjxwYXRoIGQ9Ik01MDkuODMzLDIyMi42MDloLTIyMC40NGgtMC4wMDFWMi4xNjdDMjc4LjQ2MSwwLjc0NCwyNjcuMzE3LDAsMjU2LDBjLTExLjMxOSwwLTIyLjQ2MSwwLjc0NC0zMy4zOTEsMi4xNjd2MjIwLjQ0djAuMDAxSDIuMTY3QzAuNzQ0LDIzMy41MzksMCwyNDQuNjgzLDAsMjU2YzAsMTEuMzE5LDAuNzQ0LDIyLjQ2MSwyLjE2NywzMy4zOTFoMjIwLjQ0aDAuMDAxdjIyMC40NDJDMjMzLjUzOSw1MTEuMjU2LDI0NC42ODEsNTEyLDI1Niw1MTJjMTEuMzE3LDAsMjIuNDYxLTAuNzQzLDMzLjM5MS0yLjE2N3YtMjIwLjQ0di0wLjAwMWgyMjAuNDQyQzUxMS4yNTYsMjc4LjQ2MSw1MTIsMjY3LjMxOSw1MTIsMjU2QzUxMiwyNDQuNjgzLDUxMS4yNTYsMjMzLjUzOSw1MDkuODMzLDIyMi42MDl6IiBzdHlsZT0iZmlsbDogcmdiKDIxNiwgMCwgMzkpOyI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjIuNzgzLDMyMi43ODRMMzIyLjc4MywzMjIuNzg0TDQzNy4wMTksNDM3LjAyYzUuMjU0LTUuMjUyLDEwLjI2Ni0xMC43NDMsMTUuMDQ4LTE2LjQzNWwtOTcuODAyLTk3LjgwMmgtMzEuNDgyVjMyMi43ODR6IiBzdHlsZT0iZmlsbDogcmdiKDIxNiwgMCwgMzkpOyI+PC9wYXRoPjxwYXRoIGQ9Ik0xODkuMjE3LDMyMi43ODRoLTAuMDAyTDc0Ljk4LDQzNy4wMTljNS4yNTIsNS4yNTQsMTAuNzQzLDEwLjI2NiwxNi40MzUsMTUuMDQ4bDk3LjgwMi05Ny44MDRWMzIyLjc4NHoiIHN0eWxlPSJmaWxsOiByZ2IoMjE2LCAwLCAzOSk7Ij48L3BhdGg+PHBhdGggZD0iTTE4OS4yMTcsMTg5LjIxOXYtMC4wMDJMNzQuOTgxLDc0Ljk4Yy01LjI1NCw1LjI1Mi0xMC4yNjYsMTAuNzQzLTE1LjA0OCwxNi40MzVsOTcuODAzLDk3LjgwM0gxODkuMjE3eiIgc3R5bGU9ImZpbGw6IHJnYigyMTYsIDAsIDM5KTsiPjwvcGF0aD48cGF0aCBkPSJNMzIyLjc4MywxODkuMjE5TDMyMi43ODMsMTg5LjIxOUw0MzcuMDIsNzQuOTgxYy01LjI1Mi01LjI1NC0xMC43NDMtMTAuMjY2LTE2LjQzNS0xNS4wNDdsLTk3LjgwMiw5Ny44MDNWMTg5LjIxOXoiIHN0eWxlPSJmaWxsOiByZ2IoMjE2LCAwLCAzOSk7Ij48L3BhdGg+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg=="></Image>
          { name }
        </Link>;
      }) }
    </InlineLayout>
  );
}