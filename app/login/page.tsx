"use client";
import { CustomButton, SectionTitle } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  // const session = useSession();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // Nếu đã có user trong localStorage thì redirect về trang chủ
    if (typeof window !== "undefined" && localStorage.getItem("user")) {
      router.replace("/");
      return;
    }
    // Nếu dùng next-auth và đã authenticated thì cũng redirect
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    // Kiểm tra định dạng email
    if (!email || !email.includes("@")) {
      setError("Email không hợp lệ");
      toast.error("Email không hợp lệ");
      return;
    }
    if (!password) {
      setError("Mật khẩu không được để trống");
      toast.error("Mật khẩu không được để trống");
      return;
    }

    try {
      // Đảm bảo apiUrl là domain gốc, không phải .../products
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app/products";
      const apiUrl = rawApiUrl.replace(/\/products$/, "");
      const loginUrl = `${apiUrl}/login`;
      console.log("[LOGIN] Gọi API:", loginUrl);
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errText = await res.text();
        setError(`Lỗi đăng nhập: ${res.status} - ${errText}`);
        toast.error(`Lỗi đăng nhập: ${res.status}`);
        return;
      }
      const foundUser = await res.json();
      if (!foundUser || !foundUser.id) {
        setError("Sai email hoặc mật khẩu");
        toast.error("Sai email hoặc mật khẩu");
        return;
      }
      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));
      setError("");
      toast.success("Đăng nhập thành công");
      setTimeout(() => {
        router.replace("/");
        window.location.reload();
      }, 500);
    } catch (err: any) {
      setError("Lỗi kết nối máy chủ: " + (err?.message || ""));
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="bg-white">
      <SectionTitle title="Đăng nhập" path="Trang chủ | Đăng nhập" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Đăng nhập tài khoản
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Mật khẩu
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="font-semibold text-black hover:text-black"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <div>
                <CustomButton
                  buttonType="submit"
                  text="Đăng nhập"
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                />
              </div>
            </form>
            <div className="mt-6 text-center">
              <span>Bạn chưa có tài khoản? </span>
              <a
                href="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Đăng ký ngay
              </a>
            </div>
            <p className="text-red-600 text-center text-[16px] my-4">
              {error && error}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
