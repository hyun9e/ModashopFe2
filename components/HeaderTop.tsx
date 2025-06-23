// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeadphones } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";

const HeaderTop = () => {
  // Lấy user từ localStorage (ưu tiên localStorage, fallback next-auth nếu có)
  const [user, setUser] = useState<any>(null);
  const { data: session }: any = useSession();

  // Luôn lấy user từ localStorage mỗi lần render (kể cả reload)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
      // Lắng nghe sự kiện storage để cập nhật user khi đăng nhập ở tab khác hoặc sau khi login
      const handleStorage = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        } else {
          setUser(null);
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []); // chỉ chạy 1 lần khi mount, nhưng luôn lấy user từ localStorage

  const handleLogout = () => {
    // Xóa user khỏi localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    setUser(null);
    setTimeout(() => signOut(), 500); // fallback next-auth nếu có
    toast.success("Đăng xuất thành công!");
  };
  return (
    <div className="h-10 text-white bg-blue-500 max-lg:px-5 max-lg:h-16 max-[573px]:px-0">
      <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-0">
        <ul className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
          <li className="flex items-center gap-x-2 font-semibold">
            <FaHeadphones className="text-white" />
            <span>+84 948185466</span>
          </li>
          <li className="flex items-center gap-x-2 font-semibold">
            <FaRegEnvelope className="text-white text-xl" />
            <span>moda@gmail.com</span>
          </li>
        </ul>
        <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2 font-semibold">
          {!user ? (
            <>
              <li className="flex items-center">
                <Link href="/login" className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Đăng nhập</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/register" className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Đăng ký</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <Link href="/profile">
                <span className="ml-10 text-base cursor-pointer hover:underline">{user.fullName || user.email}</span>
              </Link>
              <li className="flex items-center">
                <button onClick={handleLogout} className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Đăng xuất</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
