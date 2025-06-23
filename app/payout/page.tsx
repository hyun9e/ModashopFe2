"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PayoutPage = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [checking, setChecking] = useState(false);

  // Lấy userId từ localStorage
  const getUserId = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    }
    return null;
  };

  // Hàm kiểm tra trạng thái đơn hàng
  const checkOrderStatus = async () => {
    setChecking(true);
    const userId = getUserId();
    if (!userId) {
      setOrderStatus(null);
      setChecking(false);
      return;
    }
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
    apiUrl = apiUrl.replace(/\/products$/, "");
    const endpoint = `${apiUrl}/orders/user/${userId}`;
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json'
        }
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setOrderStatus(null);
        setChecking(false);
        return;
      }
      // Lấy đơn hàng mới nhất
      const latestOrder = Array.isArray(data) && data.length > 0 ? data[0] : null;
      if (latestOrder) {
        if (latestOrder.status === "Đang xử lý") {
          setOrderStatus("Đơn hàng của bạn chưa được thanh toán. Vui lòng quét mã và thanh toán!");
        } else if (latestOrder.status === "Đang giao") {
          setOrderStatus("Giao dịch thành công! Đơn hàng đang được giao.");
          setShowDialog(true);
          setTimeout(() => {
            setShowDialog(false);
            router.push("/");
          }, 2500);
        } else {
          setOrderStatus(`Trạng thái đơn hàng: ${latestOrder.status}`);
        }
      } else {
        setOrderStatus("Không tìm thấy đơn hàng.");
      }
    } catch (e) {
      setOrderStatus(null);
    }
    setChecking(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkOrderStatus();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const handleCancel = () => {
    // Quay về trang chủ hoặc trang shop, có thể điều chỉnh lại nếu muốn về trang khác
    router.push("/");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h1 className="text-2xl font-bold mb-6">Quét mã để thanh toán</h1>
      <Image
        src="/QR.jpg"
        alt="QR thanh toán shop"
        width={300}
        height={300}
        className="rounded border shadow mb-6"
      />
      <div className="flex gap-4">
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          disabled={refreshing || checking}
        >
          Làm mới / Kiểm tra trạng thái
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-400 text-white px-6 py-2 rounded shadow hover:bg-gray-500 transition"
          disabled={refreshing || checking}
        >
          Hủy thanh toán
        </button>
      </div>
      {refreshing && (
        <div className="mt-4 text-blue-600 font-semibold animate-pulse">
          Đang tải lại...
        </div>
      )}
      {checking && (
        <div className="mt-4 text-blue-600 font-semibold animate-pulse">
          Đang kiểm tra trạng thái đơn hàng...
        </div>
      )}
      {orderStatus && (
        <div className="mt-4 text-lg font-semibold text-center text-green-700">{orderStatus}</div>
      )}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-2xl font-bold mb-4 text-green-600">Cảm ơn bạn đã mua hàng!</div>
            <div>Đơn hàng của bạn đã được ghi nhận và đang được giao.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutPage;
