// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************

import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { getCategoryMenuList } from "@/lib/utils";
import Heading from "./Heading";

type CategoryMenuItem = {
  id: string;
  title: string;
  href: string;
  src: string;
};

const CategoryMenu = async () => {
  const categoryMenuList: CategoryMenuItem[] = await getCategoryMenuList();
  return (
    <div className="py-10 bg-blue-500">
      <Heading title="DANH MỤC SẢN PHẨM" />
      <div className="max-w-screen-2xl mx-auto py-10 gap-x-5 px-16 max-md:px-10 gap-y-5 grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-[450px]:grid-cols-1 justify-center text-center">
        {categoryMenuList.map((item: CategoryMenuItem) => (
          <CategoryItem title={item.title} key={item.id} href={item.href}>
            <Image src={item.src} width={48} height={48} alt={item.title} />
          </CategoryItem>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
