"use client";
import React, { useEffect, useState } from "react";

interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    price: number;
    name: string;
    imageUrl: string;
    size: string;
    color: string;
    quantity: number;
}

interface Order {
    id: number;
    userId: number;
    recipient: string;
    phone: string;
    address: string;
    orderDate: string;
    status: string;
    total: number;
    items: OrderItem[];
    paid: boolean;
}

interface OrdersListProps {
    userId: number;
    baseUrl: string;
}

const OrdersList: React.FC<OrdersListProps> = ({ userId, baseUrl }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        fetch(`${baseUrl}/orders/user/${userId}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch(() => setError("Không thể tải đơn hàng"))
            .finally(() => setLoading(false));
    }, [userId, baseUrl]);

    // Lọc đơn hàng theo trạng thái
    const filteredOrders = statusFilter
        ? orders.filter((order) => order.status === statusFilter)
        : orders;

    if (loading) return <div>Đang tải đơn hàng...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="mt-10">
            <h3 className="text-lg font-bold mb-2">Đơn hàng của bạn</h3>
            <div className="mb-4 flex gap-2 items-center">
                <span>Lọc theo trạng thái:</span>
                <select
                    className="border rounded px-2 py-1"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                </select>
            </div>
            {filteredOrders.length === 0 ? (
                <div>Không có đơn hàng nào phù hợp.</div>
            ) : (
                <div className="space-y-8">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 shadow-sm">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                                <div>
                                    <div className="font-semibold">Mã đơn: #{order.id}</div>
                                    <div>Người nhận: {order.recipient}</div>
                                    <div>SĐT: {order.phone}</div>
                                    <div>Địa chỉ: {order.address}</div>
                                    <div>Ngày đặt: {new Date(order.orderDate).toLocaleString()}</div>
                                    <div>Trạng thái: <span className="font-semibold">{order.status}</span></div>
                                    <div>Thanh toán: <span className={order.paid ? "text-green-600" : "text-red-600"}>{order.paid ? "Đã thanh toán" : "Chưa thanh toán"}</span></div>
                                </div>
                                <div className="text-lg font-bold text-blue-700 mt-2 md:mt-0">Tổng: {order.total.toLocaleString()}₫</div>
                            </div>
                            <div>
                                <div className="font-medium mb-1">Sản phẩm:</div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 border">Ảnh</th>
                                                <th className="p-2 border">Tên</th>
                                                <th className="p-2 border">Màu</th>
                                                <th className="p-2 border">Size</th>
                                                <th className="p-2 border">SL</th>
                                                <th className="p-2 border">Đơn giá</th>
                                                <th className="p-2 border">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="p-2 border"><img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" /></td>
                                                    <td className="p-2 border">{item.name}</td>
                                                    <td className="p-2 border">{item.color}</td>
                                                    <td className="p-2 border">{item.size}</td>
                                                    <td className="p-2 border">{item.quantity}</td>
                                                    <td className="p-2 border">{item.price.toLocaleString()}₫</td>
                                                    <td className="p-2 border">{(item.price * item.quantity).toLocaleString()}₫</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersList;
