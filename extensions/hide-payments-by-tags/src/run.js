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

  for (const paymentMethod of configuration.paymentMethods) {
    const nameDowncased = paymentMethod.toLowerCase();
    const hidePaymentMethod = input.paymentMethods.find((method) =>
      method.name.toLowerCase().includes(nameDowncased)
    );

    if (!hidePaymentMethod || !itemsWithTag) {
      continue;
    }

    operations.push({
      hide: {
        paymentMethodId: hidePaymentMethod.id,
      },
    });
  }

  if (operations.length === 0) {
    return NO_CHANGES;
  }

  return {
    operations,
  };
}
