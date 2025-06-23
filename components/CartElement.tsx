// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from 'next/link'
import React, { useEffect } from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useCartStore } from "@/app/_zustand/store";

const CartElement = () => {
    const { allQuantity, setCartFromApi } = useCartStore();
    // Lấy userId từ localStorage
    React.useEffect(() => {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.id) {
            // Xử lý biến môi trường có thể bị thừa /products
            let apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
            apiUrl = apiUrl.replace(/\/products$/, "");
            const endpoint = `${apiUrl}/cart/${user.id}`;
            console.log('[CART] Fetching:', endpoint);
            fetch(endpoint, {
              method: 'GET',
              headers: {
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json'
              }
            })
              .then(async res => {
                const text = await res.text();
                let data;
                try {
                  data = JSON.parse(text);
                } catch (e) {
                  console.error('[CART] API response is not valid JSON:', text);
                  return;
                }
                console.log('[CART] API response:', data);
                if (data && Array.isArray(data.items)) {
                  console.log('[CART] items:', data.items);
                } else {
                  console.warn('[CART] No items array in response:', data);
                }
                setCartFromApi(data.items || []);
              })
              .catch(err => {
                console.error('[CART] Fetch error:', err);
              });
          }
        }
      }
    }, [setCartFromApi]);

    // Bỏ khai báo kiểu TypeScript cho hàm updateCartItem để trở lại như cũ
    const updateCartItem = async (userId, cartId, item) => {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
      apiUrl = apiUrl.replace(/\/products$/, "");
      const endpoint = `${apiUrl}/cart/${userId}/${cartId}`;
      console.log('[CART][PUT] Updating:', endpoint, item);
      try {
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
          },
          body: JSON.stringify(item)
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('[CART][PUT] API response is not valid JSON:', text);
          return;
        }
        console.log('[CART][PUT] API response:', data);
        if (data && Array.isArray(data.items)) {
          setCartFromApi(data.items);
        } else {
          console.warn('[CART][PUT] No items array in response:', data);
        }
      } catch (err) {
        console.error('[CART][PUT] Update error:', err);
      }
    };

  return (
    <div className="relative">
      {/* Đã bỏ nút test update cart */}
      <Link href="/cart">
        <FaCartShopping className="text-2xl text-black" />
        <span className="block w-6 h-6 bg-blue-600 text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
          { allQuantity }
        </span>
      </Link>
    </div>
  )
}

export default CartElement