// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center gap-y-2 cursor-pointer bg-white py-5 px-2 text-black hover:bg-gray-100 min-h-[180px] min-w-[140px] max-w-[160px] w-full h-full rounded-lg shadow-sm justify-center">
        <div className="flex items-center justify-center w-[64px] h-[64px] mb-2">
          {children}
        </div>
        <h3 className="font-semibold text-xl text-center break-words leading-tight min-h-[48px] flex items-center justify-center">{title}</h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
