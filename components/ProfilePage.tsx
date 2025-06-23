"use client";
import React, { useEffect, useState } from "react";
import AccountInfoForm from "./AccountInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import OrdersList from "./OrdersList";

const tabs = [
    { key: "info", label: "Thông tin cá nhân" },
    { key: "password", label: "Đổi mật khẩu" },
    { key: "orders", label: "Theo dõi đơn hàng" },
];

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("info");
    let userId = 1;
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj && userObj.id) userId = userObj.id;
            } catch { }
        }
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";

    return (
        <div className="max-w-6xl mx-auto py-10 flex gap-8 min-h-[80vh]">
            <aside className="w-1/4 min-w-[200px]">
                <ul className="space-y-2">
                    {tabs.map(tab => (
                        <li key={tab.key}>
                            <button
                                className={`w-full text-left px-4 py-2 rounded ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-100'}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="flex-1 min-w-0">
                {activeTab === "info" && <AccountInfoForm />}
                {activeTab === "password" && <ChangePasswordForm userId={userId} baseUrl={baseUrl} />}
                {activeTab === "orders" && <OrdersList userId={userId} baseUrl={baseUrl} />}
            </main>
        </div>
    );
};

export default ProfilePage;
