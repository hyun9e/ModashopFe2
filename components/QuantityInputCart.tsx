// *********************
// Role of the component: Quantity input for incrementing and decrementing product quantity on the cart page
// Name of the component: QuantityInputCart.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <QuantityInputCart product={product} />
// Input parameters: { product: ProductInCart }
// Output: one number input and two buttons
// *********************

"use client";
import { ProductInCart, useCartStore } from "@/app/_zustand/store";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

const QuantityInputCart = ({ product } : { product: ProductInCart }) => {
  const [quantityCount, setQuantityCount] = useState<number>(product.quantity);
  const { updateCartAmount } = useCartStore();

  // Nếu product.quantity thay đổi từ ngoài (ví dụ khi đồng bộ cart), cập nhật lại state
  React.useEffect(() => {
    setQuantityCount(product.quantity);
  }, [product.quantity]);

  const handleQuantityChange = (actionName: string): void => {
    if (actionName === "plus") {
      setQuantityCount((prev) => {
        const newVal = prev + 1;
        updateCartAmount(product.id, newVal);
        return newVal;
      });
    } else if (actionName === "minus" && quantityCount !== 1) {
      setQuantityCount((prev) => {
        const newVal = prev - 1;
        updateCartAmount(product.id, newVal);
        return newVal;
      });
    }
  };

  return (
    <div>
      <label htmlFor="Quantity" className="sr-only">
        {" "}
        Quantity{" "}
      </label>

      <div className="flex items-center justify-center rounded border border-gray-200 w-32">
        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex items-center justify-center"
          onClick={() => handleQuantityChange("minus")}
        >
          <FaMinus />
        </button>

        <input
          type="number"
          id="Quantity"
          disabled={true}
          value={quantityCount}
          className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex items-center justify-center"
          onClick={() => handleQuantityChange("plus")}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default QuantityInputCart;
