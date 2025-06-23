"use client";

// *********************
// Role of the component: Button for adding and removing product to the wishlist on the single product page
// Name of the component: AddToWishlistBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToWishlistBtn product={product} slug={slug}  />
// Input parameters: AddToWishlistBtnProps interface
// Output: Two buttons with adding and removing from the wishlist functionality
// *********************

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

interface AddToWishlistBtnProps {
  product: Product;
  slug: string;
}

const AddToWishlistBtn = ({ product, slug }: AddToWishlistBtnProps) => {
  // Ưu tiên lấy user từ localStorage, fallback next-auth
  const [user, setUser] = useState<any>(null);
  const { data: session, status } = useSession();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [isProductInWishlist, setIsProductInWishlist] = useState<boolean>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    }
  }, [session?.user]);

  const addToWishlistFun = async () => {
    // Lấy userId và email từ localStorage hoặc session
    const userId = user?.id;
    const userEmail = user?.email || session?.user?.email;
    if (userId || userEmail) {
      // Ưu tiên userId, nếu không có thì lấy qua email
      let finalUserId = userId;
      if (!finalUserId && userEmail) {
        // Lấy userId từ API qua email
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/email/${userEmail}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        finalUserId = data?.id;
      }
      if (!finalUserId) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product?.id, userId: finalUserId }),
      })
        .then((response) => response.json())
        .then((data) => {
          addToWishlist({
            id: String(product?.id),
            title: product?.title,
            price: product?.price,
            image: product?.mainImage,
            slug: String(product?.slug),
            stockAvailabillity: Number(product?.inStock ?? 0),
          });
          toast.success("Đã thêm vào danh sách yêu thích");
        });
    } else {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào yêu thích");
    }
  };

  const removeFromWishlistFun = async () => {
    const userId = user?.id;
    const userEmail = user?.email || session?.user?.email;
    let finalUserId = userId;
    if (!finalUserId && userEmail) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/email/${userEmail}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      finalUserId = data?.id;
    }
    if (!finalUserId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${finalUserId}/${product?.id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        removeFromWishlist(String(product?.id));
        toast.success("Đã xóa khỏi danh sách yêu thích");
      });
  };

  const isInWishlist = async () => {
    const userId = user?.id;
    const userEmail = user?.email || session?.user?.email;
    let finalUserId = userId;
    if (!finalUserId && userEmail) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/email/${userEmail}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      finalUserId = data?.id;
    }
    if (finalUserId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${finalUserId}/${product?.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data[0]?.id) {
            setIsProductInWishlist(() => true);
          } else {
            setIsProductInWishlist(() => false);
          }
        });
    }
  };

  useEffect(() => {
    isInWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, wishlist]);

  const handleWorkInProgress = () => {
    window.alert("Tính năng Yêu thích đang được phát triển!");
  };

  return (
    <>
      {isProductInWishlist ? (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={handleWorkInProgress}
        >
          <FaHeartCrack className="text-xl text-custom-black" />
          <span className="text-lg">XÓA KHỎI YÊU THÍCH</span>
        </p>
      ) : (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={handleWorkInProgress}
        >
          <FaHeart className="text-xl text-custom-black" />
          <span className="text-lg">THÊM VÀO YÊU THÍCH</span>
        </p>
      )}
    </>
  );
};

export default AddToWishlistBtn;
