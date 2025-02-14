# INSTRUCTIONS

first find the function
```graphql
query {
  shopifyFunctions(first: 25) {
    nodes {
      app {
        title
      }
      apiType
      title
      id
    }
  }
}
```

then create the mutation using the id from the above query
```graphql
mutation paymentCustomizationCreate($paymentCustomization: PaymentCustomizationInput!) {
  paymentCustomizationCreate(paymentCustomization: $paymentCustomization) {
    paymentCustomization {
      id
    }
    userErrors {
      field
      message
    }
  }
}
```

use this input
```json
{
  "paymentCustomization": {
    "enabled": true,
    "functionId": "FunctionId",
    "metafields": [
      {
        "namespace": "hide-payments-by-tags",
        "key": "function-configuration",
        "value": "{ \"paymentMethods\": [\"Cash on Delivery\", \"Afterpay\"], \"tagList\": [\"hide_afterpay\"] }",
        "type": "json"
      }
    ],
    "title": "Hide Payments by Tags"
  }
}
```

updating the function values after creation:

```graphql
{
  paymentCustomizations(first: 25) {
    edges {
      node {
        id
      }
    }
  }
}
```

get the id

```graphql
mutation paymentCustomizationUpdate($id: ID!, $paymentCustomization: PaymentCustomizationInput!) {
  paymentCustomizationUpdate(id: $id, paymentCustomization: $paymentCustomization) {
    paymentCustomization {
      # PaymentCustomization fields
    }
    userErrors {
      field
      message
    }
  }
}
```

update the function values

```json
{
  "id": "gid://shopify/<objectName>/10079785100",
  "paymentCustomization": {
    "enabled": true,
    "functionId": "<your-functionId>",
    "metafields": [
      {
        "description": "<your-description>",
        "id": "gid://shopify/<objectName>/10079785100",
        "key": "<your-key>",
        "namespace": "<your-namespace>",
        "type": "<your-type>",
        "value": "<your-value>"
      }
    ],
    "title": "<your-title>"
  }
}
```

