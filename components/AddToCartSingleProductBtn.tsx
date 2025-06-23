// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount}  />
// Input parameters: SingleProductBtnProps interface
// Output: Button with adding to cart functionality
// *********************
"use client";



import React from "react";
import { useCartStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";



const AddToCartSingleProductBtn = ({ product, quantityCount } : SingleProductBtnProps) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: String(product?.id),
      productId: String(product?.id),
      name: product?.name,
      imageUrl: product?.imageUrl,
      price: product?.price,
      size: product?.size,
      color: product?.color,
      quantity: quantityCount,
    });
    toast.success("Đã thêm vào giỏ hàng");
  };
  return (
    <button
      onClick={handleAddToCart}
      className="btn w-[200px] text-lg border border-gray-300 border-1 font-normal bg-white text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110 transition-all uppercase ease-in max-[500px]:w-full"
    >
      Add to cart
    </button>
  );
};

export default AddToCartSingleProductBtn;
