// Backend shop products currently have no image field. This returns the
// product image when present, otherwise a stable, readable placeholder so
// cards/lists never render a broken <img>.
export function productImage(product) {
  if (!product) return placeholder("Product");
  if (product.images?.[0]) return product.images[0];
  if (product.image) return product.image;
  return placeholder(product.name || product.brand || "Product");
}

function placeholder(name) {
  const label = encodeURIComponent(String(name).slice(0, 18));
  return `https://ui-avatars.com/api/?name=${label}&background=ecfdf5&color=059669&size=200&length=2&font-size=0.3`;
}
