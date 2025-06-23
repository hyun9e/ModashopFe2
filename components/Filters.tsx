// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import CategoryFilter from "./CategoryFilter";

interface InputCategory { }

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { page } = usePaginationStore();
  const { sortBy } = useSortStore();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sort", sortBy);
    params.set("page", page.toString());
    if (categoryId) params.set("categoryId", categoryId.toString());
    replace(`${pathname}?${params}`);
  }, [sortBy, page, categoryId]);

  return (
    <div>
      <h3 className="text-2xl mb-4">Lọc</h3>
      <CategoryFilter baseUrl={baseUrl} onChange={setCategoryId} />
    </div>
  );
};

export default Filters;
