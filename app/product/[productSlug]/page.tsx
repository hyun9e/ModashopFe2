import {
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
  SingleProductDynamicFields,
  AddToWishlistBtn,
} from "@/components";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import ProductVariantsSelector from "@/components/ProductVariantsSelector";
import AddToCartSingleProductBtn from "@/components/AddToCartSingleProductBtn";
import ProductDetailClient from "@/components/ProductDetailClient";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  // Lấy dữ liệu sản phẩm từ API mới
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app/products";
  const data = await fetch(`${apiUrl}/${params.productSlug}`, { cache: "no-store" });
  if (!data.ok) {
    notFound();
  }
  const product = await data.json();

  // Lấy biến thể sản phẩm trực tiếp từ product (API mới trả về trong từng product)
  const variants = product.variants || [];

  // Nếu API mới có endpoint cho nhiều ảnh, có thể fetch thêm ở đây
  // const imagesData = await fetch(`${apiUrl}/${params.productSlug}/images`);
  // const images = imagesData.ok ? await imagesData.json() : [];
  const images = product.images || [];

  if (!product || product.error) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
          <div>
            <Image
              src={product?.imageUrl ? product?.imageUrl : "/product_placeholder.jpg"}
              width={450}
              height={450}
              alt="main image"
              className="w-[450px] h-[450px] object-contain mx-auto"
            />
            <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
              {images?.map((imageItem: any, idx: number) => (
                <Image
                  key={imageItem.id || idx}
                  src={imageItem.url || imageItem.imageUrl || imageItem.image}
                  width={120}
                  height={120}
                  alt="product image"
                  className="w-[120px] h-[120px] object-contain"
                />
              ))}
            </div>
          </div>
          {/* Toàn bộ logic động chuyển sang Client Component */}
          <ProductDetailClient product={product} variants={variants} params={params} />
        </div>
        <div className="py-16">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
