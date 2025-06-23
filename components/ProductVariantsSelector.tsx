"use client";
import React from "react";

interface Variant {
  id: number;
  size: string;
  color: string;
  stock: number;
}

interface ProductVariantsSelectorProps {
  variants: Variant[];
  onStockChange?: (stock: number) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  product?: any; // optional, để log currentProduct nếu cần
  quantity?: number;
}

const ProductVariantsSelector: React.FC<ProductVariantsSelectorProps> = ({
  variants,
  onStockChange,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  product,
  quantity
}) => {
  const uniqueColors = Array.from(new Set(variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));

  // Lấy tồn kho đúng với biến thể đã chọn
  const selectedVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  React.useEffect(() => {
    if (onStockChange) onStockChange(selectedVariant?.stock ?? 0);
  }, [selectedColor, selectedSize, selectedVariant?.stock, onStockChange]);

  // Hàm log currentProduct khi chọn
  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    if (product) {
      const currentProduct = {
        productId: product?.id,
        name: product?.name,
        imageUrl: product?.imageUrl,
        price: product?.price,
        size: selectedSize,
        color: color,
        quantity: quantity || 1,
      };
      console.log("currentProduct:", currentProduct);
    }
  };
  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    if (product) {
      const currentProduct = {
        productId: product?.id,
        name: product?.name,
        imageUrl: product?.imageUrl,
        price: product?.price,
        size: size,
        color: selectedColor,
        quantity: quantity || 1,
      };
      console.log("currentProduct:", currentProduct);
    }
  };

  return (
    <div className="my-4">
      <div className="font-semibold mb-2">Chọn màu:</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {uniqueColors.map((color) => (
          <button
            key={color}
            type="button"
            className={`border rounded px-3 py-1 text-sm ${selectedColor === color ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleSelectColor(color)}
          >
            {color}
          </button>
        ))}
      </div>
      <div className="font-semibold mb-2">Chọn size:</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {uniqueSizes.map((size) => (
          <button
            key={size}
            type="button"
            className={`border rounded px-3 py-1 text-sm ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleSelectSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
      {selectedColor && selectedSize && (
        <div className="mt-2 text-base">
          Số lượng còn lại: <b>{selectedVariant?.stock ?? 0}</b>
        </div>
      )}
    </div>
  );
};

export default ProductVariantsSelector;
