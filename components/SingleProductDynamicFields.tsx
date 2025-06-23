// *********************
// Role of the component: Helper component for seperating dynamic client component from server component on the single product page with the intention to preserve SEO benefits of Next.js
// Name of the component: SingleProductDynamicFields.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SingleProductDynamicFields product={product} />
// Input parameters: { product: Product }
// Output: Quantity, add to cart and buy now component on the single product page
// *********************

"use client";
import React from "react";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";
import BuyNowSingleProductBtn from "./BuyNowSingleProductBtn";

const SingleProductDynamicFields = ({
  product,
  maxStock = 1000,
  quantity,
  setQuantity
}: {
  product: Product;
  maxStock?: number;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // Đảm bảo không vượt quá maxStock và không nhỏ hơn 1 nếu còn hàng
  React.useEffect(() => {
    if (quantity > maxStock) setQuantity(maxStock);
    if (maxStock > 0 && quantity < 1) setQuantity(1);
  }, [maxStock, quantity, setQuantity]);
  return (
    <>
      <QuantityInput
        quantityCount={quantity}
        setQuantityCount={setQuantity}
        maxStock={maxStock}
      />
      {maxStock > 0 && (
        <div className="flex gap-x-5 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-y-1">
          <AddToCartSingleProductBtn
            quantityCount={quantity}
            product={product}
          />
          {/* <BuyNowSingleProductBtn
            quantityCount={quantity}
            product={product}
          /> */}
        </div>
      )}
    </>
  );
};

export default SingleProductDynamicFields;
