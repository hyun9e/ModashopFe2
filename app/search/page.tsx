import { ProductItem, SectionTitle } from "@/components";
import React from "react";

interface Props {
  searchParams: { search: string };
}

// sending api request for search results for a given search text
const SearchPage = async ({ searchParams: { search } }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
  const endpoint = `${apiUrl.replace(/\/products$/, "")}/products/api/search?query=${encodeURIComponent(search || "")}`;
  const data = await fetch(endpoint, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Accept': 'application/json'
    }
  });
  const products = await data.json();

  return (
    <div>
      <SectionTitle title="Kết quả tìm kiếm" path="Trang chủ | Tìm kiếm" />
      <div className="max-w-screen-2xl mx-auto">
        {search && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl">
            Kết quả cho từ khóa: <span className="text-blue-600 font-bold">{search}</span>
          </h3>
        )}
        <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <ProductItem key={product.id} product={product} color="black" />
            ))
          ) : (
            <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg text-red-600">
              Không tìm thấy sản phẩm phù hợp
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

/*

*/
