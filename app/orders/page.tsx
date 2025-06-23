"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      let userId = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          userId = user.id;
        }
      }
      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
        apiUrl = apiUrl.replace(/\/products$/, "");
        const res = await fetch(`${apiUrl}/orders/user/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (e) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8">Đang tải đơn hàng...</div>;
  if (!orders.length) return <div className="p-8">Không có đơn hàng nào.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của bạn</h1>
      {orders.map((order) => (
        <div key={order.id} className="mb-8 border rounded-lg p-4 bg-white shadow">
          <div className="mb-2 flex flex-wrap gap-4 justify-between items-center">
            <div>
              <span className="font-semibold">Mã đơn hàng:</span> #{order.id}
            </div>
            <div>
              <span className="font-semibold">Ngày đặt:</span> {new Date(order.orderDate).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Trạng thái:</span> {order.status}
            </div>
            <div>
              <span className="font-semibold">Tổng tiền:</span> {order.total?.toLocaleString()}₫
            </div>
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
                {order.items.map((item: any) => (
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
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
