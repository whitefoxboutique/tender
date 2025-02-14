const NO_CHANGES = {
  operations: [],
};

export function run(input) {
  const configuration = JSON.parse(
    input?.paymentCustomization?.metafield?.value ?? "{}"
  );

  if (!configuration.paymentMethods || !configuration.paymentMethods.length > 0) {
    return NO_CHANGES;
  }

  const itemsWithTag = input.cart.lines.some(
    (line) =>
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.product.hasAnyTag
  );

  const operations = [];

  console.log("itemsWithTag", itemsWithTag);
  console.log("configuration.paymentMethods", configuration.paymentMethods);

  for (const paymentMethod of configuration.paymentMethods) {
    const hidePaymentMethod = input.paymentMethods.find((method) =>
      method.name.includes(paymentMethod)
    );

    if (!hidePaymentMethod || !itemsWithTag) {
      continue;
    }

    console.log(hidePaymentMethod.id);

    operations.push({
      hide: {
        paymentMethodId: hidePaymentMethod.id,
      },
    });
  }

  console.log("operations", operations);

  if (operations.length === 0) {
    return NO_CHANGES;
  }

  return {
    operations,
  };
}
