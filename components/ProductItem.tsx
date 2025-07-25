// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";

// Bổ sung type Product mở rộng cho phép có imageUrl, name (API search) hoặc mainImage, title (home)
type ProductWithCompat = Product & {
  imageUrl?: string;
  name?: string;
};

const ProductItem = ({
  product,
  color,
}: {
  product: ProductWithCompat;
  color: string;
}) => {
  // Lấy discount nếu có, mặc định 0
  const discount = product.discount || 0;
  // Lấy tên danh mục nếu có
  const categoryName = typeof product.category === "object" && product.category !== null ? product.category.name : (product.category || "");
  // Hỗ trợ cả hai kiểu dữ liệu: API mới (imageUrl, name) và cũ (mainImage, title)
  const img = product.imageUrl || (product as any).mainImage || "/product_placeholder.jpg";
  const title = product.name || (product as any).title || "Sản phẩm";
  return (
    <div className="flex flex-col items-center gap-y-2">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={img}
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-[300px]"
          alt={title}
        />
      </Link>
      <Link
        href={`/product/${product.slug}`}
        className={
          color === "black"
            ? `text-xl text-black font-normal mt-2 uppercase`
            : `text-xl text-white font-normal mt-2 uppercase`
        }
      >
        {title}
      </Link>
      <p
        className={
          color === "black"
            ? "text-lg text-black font-semibold"
            : "text-lg text-white font-semibold"
        }
      >
        {discount > 0 ? (
          <>
            <span className="line-through text-gray-400 mr-2">{product.price.toLocaleString()}₫</span>
            <span className="text-red-500 font-bold">{(product.price * (1 - discount / 100)).toLocaleString()}₫</span>
          </>
        ) : (
          <span>{product.price.toLocaleString()}₫</span>
        )}
      </p>
      {categoryName && (
        <span className="text-xs text-gray-300 italic mb-1">{categoryName}</span>
      )}
      {product.description && (
        <span className="text-xs text-gray-200 text-center mb-1">{product.description}</span>
      )}
      {/* <ProductItemRating productRating={product?.rating} /> */}
      <Link
        href={`/product/${product?.slug}`}
        className="block flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
      >
        <p>Xem chi tiết</p>
      </Link>
    </div>
  );
};

export default ProductItem;
