"use client";
import React, { useState, useEffect } from "react";
import ProductVariantsSelector from "./ProductVariantsSelector";
import SingleProductDynamicFields from "./SingleProductDynamicFields";
import AddToWishlistBtn from "./AddToWishlistBtn";
import { FaSquareFacebook, FaSquareXTwitter, FaSquarePinterest } from "react-icons/fa6";
import Image from "next/image";

const ProductDetailClient = ({ product, variants, params }: any) => {
  // Lấy danh sách màu và size từ variants
  const uniqueColors: string[] = Array.from(new Set(variants.map((v: any) => String(v.color ?? ""))));
  const uniqueSizes: string[] = Array.from(new Set(variants.map((v: any) => String(v.size ?? ""))));

  // State cho các lựa chọn
  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState<string>(uniqueSizes[0] ?? "");
  const [quantity, setQuantity] = useState<number>(1);
  const [maxStock, setMaxStock] = useState<number>(
    variants.find((v: any) => v.color === selectedColor && v.size === selectedSize)?.stock || 0
  );

  // Cập nhật maxStock khi chọn biến thể mới
  useEffect(() => {
    const found = variants.find((v: any) => v.color === selectedColor && v.size === selectedSize);
    setMaxStock(found?.stock || 0);
    // Nếu số lượng vượt quá tồn kho thì giảm về tồn kho
    if (quantity > (found?.stock || 0)) setQuantity(found?.stock || 1);
  }, [selectedColor, selectedSize, variants]);

  // Object đồng bộ lựa chọn hiện tại
  const currentProduct = {
    productId: product?.id,
    name: product?.name,
    imageUrl: product?.imageUrl,
    price: product?.price,
    size: selectedSize,
    color: selectedColor,
    quantity: quantity,
  };

  // Log currentProduct mỗi khi thay đổi
  useEffect(() => {
    console.log("currentProduct:", currentProduct);
  }, [currentProduct]);

  return (
    <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
      <h1 className="text-3xl">{product?.name}</h1>
      <p className="text-xl font-semibold">{product?.price?.toLocaleString()}₫</p>
      {/* Truyền quantity và setQuantity xuống SingleProductDynamicFields */}
      <SingleProductDynamicFields product={{ ...product, size: selectedSize, color: selectedColor }} maxStock={maxStock} quantity={quantity} setQuantity={setQuantity} />
      {variants.length > 0 && (
        <ProductVariantsSelector
          variants={variants}
          onStockChange={setMaxStock}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          product={product}
          quantity={quantity}
        />
      )}
      <div className="flex flex-col gap-y-2 max-[500px]:items-center">
        {/* <AddToWishlistBtn product={product} slug={params.productSlug} /> */}
        <p className="text-lg">SKU (ID): <span className="ml-1">{product?.sku || product?.id || params.productSlug}</span></p>
        <p className="text-lg">Giá: <span className="ml-1">{product?.price?.toLocaleString()}₫</span></p>
        <p className="text-lg">Danh mục: <span className="ml-1">{product?.category?.name || ''}</span></p>
        <p className="text-lg">Mô tả: <span className="ml-1">{product?.description}</span></p>
      </div>
    </div>
  );
};

export default ProductDetailClient;
