"use client";

import React, { useEffect, useState } from 'react';

interface UserInfo {
    id: number;
    email: string;
    fullName: string;
    address: string;
    phone: string;
}

const AccountInfoForm: React.FC = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [form, setForm] = useState({
        email: '',
        fullName: '',
        address: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Lấy userId thực tế từ localStorage nếu có
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

    useEffect(() => {
        setLoading(true);
        fetch(`${baseUrl}/users/${userId}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setForm({
                    email: data.email || '',
                    fullName: data.fullName || '',
                    address: data.address || '',
                    phone: data.phone || '',
                });
            })
            .catch(() => setError('Không thể tải thông tin người dùng'))
            .finally(() => setLoading(false));
    }, [userId, baseUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            const res = await fetch(`${baseUrl}/users/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Cập nhật thất bại');
            setSuccess(true);
        } catch {
            setError('Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) return <div>Đang tải...</div>;
    if (error && !user) return <div className="text-red-500">{error}</div>;

    return (
        <form className="space-y-6 max-w-lg" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
            <div>
                <label className="block mb-1 font-medium">Tên</label>
                <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Số điện thoại</label>
                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Địa chỉ</label>
                <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            {success && <div className="text-green-600">Cập nhật thành công!</div>}
            {error && <div className="text-red-500">{error}</div>}
        </form>
    );
};

export default AccountInfoForm;
