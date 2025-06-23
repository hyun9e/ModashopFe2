"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/app/_zustand/store";

const CheckoutPage = () => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const { cartItems, total } = useCartStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let userId = null;
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id;
      }
    }
    if (!userId) return;
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
    apiUrl = apiUrl.replace(/\/products$/, "");
    const endpoint = `${apiUrl}/orders`;
    const body = { recipient, address, phone, userId, items: cartItems };
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const status = res.status;
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('[ORDERS][POST] API response is not valid JSON:', text);
      }
      console.log('[ORDERS][POST] response:', data, 'status:', status);
      setOrder(data);
      setShowForm(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  // Không fetch orders khi vào, chỉ lấy cartItems
  if (loading) return <div className="p-8">Đang tải đơn hàng...</div>;
  if (showForm) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Tạo đơn hàng mới</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Người nhận</label>
            <input type="text" className="w-full border rounded p-2" value={recipient} onChange={e => setRecipient(e.target.value)} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Địa chỉ</label>
            <input type="text" className="w-full border rounded p-2" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input type="text" className="w-full border rounded p-2" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Ảnh</th>
                  <th className="p-2 border">Tên sản phẩm</th>
                  <th className="p-2 border">Màu</th>
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Số lượng</th>
                  <th className="p-2 border">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: any) => (
                  <tr key={item.id}>
                    <td className="p-2 border">
                      <Image src={item.imageUrl} width={60} height={60} alt={item.name} className="object-cover rounded" />
                    </td>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.color}</td>
                    <td className="p-2 border">{item.size}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">{item.price?.toLocaleString()}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right font-bold">Tổng tiền: {total?.toLocaleString()}₫</div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Xác nhận</button>
        </form>
      </div>
    );
  }
  if (order) {
    // Đơn hàng đã tạo thành công, chỉ hiển thị thông tin đơn và cảm ơn, KHÔNG còn nút "Thanh toán"
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng đã tạo thành công</h1>
        <div className="mb-8 border rounded-lg p-4 bg-white shadow">
          <div className="mb-2 flex flex-wrap gap-4 justify-between items-center">
            <div>
              <span className="font-semibold">Mã đơn hàng:</span> #{order.id}
            </div>
            <div>
              <span className="font-semibold">Ngày đặt:</span> {order.orderDate ? new Date(order.orderDate).toLocaleString() : ""}
            </div>
            <div>
              <span className="font-semibold">Trạng thái:</span> {order.status}
            </div>
            <div>
              <span className="font-semibold">Tổng tiền:</span> {order.total?.toLocaleString()}₫
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Người nhận:</span> {order.recipient} | <span className="font-semibold">SĐT:</span> {order.phone} | <span className="font-semibold">Địa chỉ:</span> {order.address}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Ảnh</th>
                  <th className="p-2 border">Tên sản phẩm</th>
                  <th className="p-2 border">Màu</th>
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Số lượng</th>
                  <th className="p-2 border">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(order.items) && order.items.length > 0 ? order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="p-2 border">
                      <Image src={item.imageUrl} width={60} height={60} alt={item.name} className="object-cover rounded" />
                    </td>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.color}</td>
                    <td className="p-2 border">{item.size}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">{item.price?.toLocaleString()}₫</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center p-2">Không có sản phẩm nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-green-700 text-lg font-semibold text-center mt-8">
          Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý sớm nhất.
        </div>
      </div>
    );
  }
  return null;
};

export default CheckoutPage;
