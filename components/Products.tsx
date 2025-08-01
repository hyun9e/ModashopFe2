// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products slug={slug} />
// Input parameters: { slug }: any
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";

const Products = async ({ slug }: any) => {
  // Lấy categoryId từ query
  const categoryId = slug?.searchParams?.categoryId;
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = slug?.searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = slug?.searchParams?.outOfStock === "true" ? 1 : 0;
  const page = slug?.searchParams?.page ? Number(slug?.searchParams?.page) : 1;

  let stockMode: string = "lte";

  // preparing inStock and out of stock filter for GET request
  // If in stock checkbox is checked, stockMode is "equals"
  if (inStockNum === 1) {
    stockMode = "equals";
  }
  // If out of stock checkbox is checked, stockMode is "lt"
  if (outOfStockNum === 1) {
    stockMode = "lt";
  }
  // If in stock and out of stock checkboxes are checked, stockMode is "lte"
  if (inStockNum === 1 && outOfStockNum === 1) {
    stockMode = "lte";
  }
  // If in stock and out of stock checkboxes aren't checked, stockMode is "gt"
  if (inStockNum === 0 && outOfStockNum === 0) {
    stockMode = "gt";
  }

  // sending API request for getting all products giống ProductsSection
  let products: any[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app/products";
    let fetchUrl = apiUrl;
    if (categoryId) {
      fetchUrl = `${apiUrl}/category/${categoryId}`;
    }
    const res = await fetch(fetchUrl, { cache: "no-store" });
    if (res.ok) {
      const apiProducts = await res.json();
      let mappedProducts = apiProducts.map((item: any) => ({
        id: item.id,
        title: item.name,
        price: item.price,
        mainImage: item.imageUrl,
        slug: item.id,
        rating: 5,
        description: item.description,
        discount: item.discount,
        category: item.category?.name || '',
      }));
      // Sắp xếp theo sortBy
      switch (slug?.searchParams?.sort) {
        case "titleAsc":
          mappedProducts = mappedProducts.sort((a: any, b: any) => a.title.localeCompare(b.title));
          break;
        case "titleDesc":
          mappedProducts = mappedProducts.sort((a: any, b: any) => b.title.localeCompare(a.title));
          break;
        case "lowPrice":
          mappedProducts = mappedProducts.sort((a: any, b: any) => a.price - b.price);
          break;
        case "highPrice":
          mappedProducts = mappedProducts.sort((a: any, b: any) => b.price - a.price);
          break;
        default:
          break;
      }
      products = mappedProducts;
    }
  } catch (e) {
    products = [];
  }

  /*
    const req = await fetch(
    `http://localhost:1337/api/products?populate=*&filters[price][$lte]=${
      searchParams?.price || 1000
    }${searchParams.women === "true" ? "&filters[category][$eq]=women" : ""}${searchParams.womenNewEdition === "true" ? "&filters[category][$eq]=women%20new%20edition" : ""}&filters[rating][$gte]=${
      searchParams?.rating || 1
    }`
  );
  const products = await req.json();
  */
  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: Product) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
