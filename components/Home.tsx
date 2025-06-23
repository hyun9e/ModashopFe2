// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Home.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Home />
// Input parameters: no input parameters
// Output: Classical hero component with two columns on desktop and one column on smaller devices
// *********************

import Image from "next/image";
import React from "react";

const Home = () => {
  return (
    <div className="h-[700px] w-full bg-blue-500 max-lg:h-[900px] max-md:h-[750px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2 max-w-3xl w-full items-center text-center mx-auto">
          <h1 className="text-7xl text-white font-bold mb-3 max-xl:text-6xl max-md:text-5xl max-sm:text-3xl leading-tight break-words">
            MODA - THỜI TRANG CHO MỌI NGƯỜI
          </h1>
          <p className="text-white text-lg max-sm:text-base max-w-2xl mx-auto">
            Khám phá bộ sưu tập thời trang mới nhất, đa dạng phong cách từ năng động, trẻ trung đến thanh lịch, sang trọng. Ưu đãi hấp dẫn, giao hàng toàn quốc, đổi trả dễ dàng. Hãy làm mới tủ đồ của bạn cùng MODA ngay hôm nay!
          </p>
          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1 justify-center">
            <a href="/shop">
              <button className="bg-white text-blue-600 font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-gray-100">
                MUA NGAY
              </button>
            </a>
            <a href="/shop">
              <button className="bg-white text-blue-600 font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-gray-100">
                XEM BỘ SƯU TẬP
              </button>
            </a>
          </div>
        </div>
        <Image
          src="/watch for banner.png"
          width={400}
          height={400}
          alt="banner thời trang"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default Home;
