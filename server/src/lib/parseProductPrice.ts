const parseProductPrice = (price: string | number): number => {
  const parsedPrice = Number(price);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    throw new Error("Invalid product price.");
  }

  if (!Number.isInteger(parsedPrice)) {
    throw new Error("Product price must be a whole number.");
  }

  return parsedPrice;
};

export default parseProductPrice;
