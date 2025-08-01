"use client";

import {
  CustomButton,
  QuantityInput,
  QuantityInputCart,
  SectionTitle,
} from "@/components";
import Image from "next/image";
import React from "react";
import { FaCheck, FaClock, FaCircleQuestion, FaXmark } from "react-icons/fa6";
import { useCartStore } from "../_zustand/store";
import Link from "next/link";
import toast from "react-hot-toast";

const CartPage = () => {
  const { cartItems, allQuantity, total, removeFromCart, clearCart, setCartFromApi } = useCartStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success("Product removed from the cart");
  };

  return (
    <div className="bg-white">
      <SectionTitle title="Cart Page" path="Home | Cart" />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <Image
                        width={192}
                        height={192}
                        src={item?.imageUrl || "/product_placeholder.jpg"}
                        alt={item?.name || "product image"}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`#`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {item.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{item.color}</p>
                            {item.size ? (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{item.size}</p>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {item.price?.toLocaleString()}₫
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <QuantityInputCart product={item} />
                          <div className="absolute right-0 top-0">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <FaXmark className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <FaCheck
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                        <span>Còn hàng</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Tạm tính</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {total?.toLocaleString()}₫
                  </dd>
                </div>
                {/* Ẩn shipping/tax USD, chỉ hiển thị tổng */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Tổng cộng
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {total?.toLocaleString()}₫
                  </dd>
                </div>
              </dl>
              {cartItems.length > 0 && (
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="block flex justify-center items-center w-full uppercase bg-white px-4 py-3 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
                  >
                    <span>Thanh toán</span>
                  </Link>
                </div>
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
