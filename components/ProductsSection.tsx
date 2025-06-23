// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";

const ProductsSection = async () => {
	// Fetch dữ liệu từ API qua biến môi trường
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app/products";
	const res = await fetch(apiUrl, { cache: "no-store" });
	const apiProducts = await res.json();
	// Map dữ liệu cho ProductItem phù hợp với web bán quần áo
	const products = apiProducts.map((item: any) => ({
		id: item.id,
		title: item.name, // tên sản phẩm
		price: item.price, // giá
		mainImage: item.imageUrl, // ảnh sản phẩm (link trực tiếp)
		slug: item.id, // dùng id làm slug
		rating: 5, // tạm thời mock rating
		description: item.description, // mô tả sản phẩm
		discount: item.discount, // giảm giá nếu có
		category: item.category, // truyền object category luôn
		variants: item.variants || [], // truyền variants nếu cần dùng ở ProductItem
	})).slice(0, 8);
	return (
		<div className="bg-blue-500 border-t-4 border-white">
			<div className="max-w-screen-2xl mx-auto pt-20">
				<Heading title="SẢN PHẨM THỜI TRANG NỔI BẬT" />
				<div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
					{products.map((product: any) => (
						<ProductItem key={product.id} product={product} color="white" />
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductsSection;
