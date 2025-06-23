"use client";
import React, { useState } from "react";

interface ChangePasswordProps {
    userId: number;
    baseUrl: string;
}

const ChangePasswordForm: React.FC<ChangePasswordProps> = ({ userId, baseUrl }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${baseUrl}/users/${userId}/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Đổi mật khẩu thất bại");
            setSuccess(data.message || "Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err.message || "Đổi mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4 max-w-lg mt-8" onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold mb-2">Đổi mật khẩu</h3>
            <div>
                <label className="block mb-1 font-medium">Mật khẩu cũ</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Mật khẩu mới</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
            {success && <div className="text-green-600">{success}</div>}
            {error && <div className="text-red-500">{error}</div>}
        </form>
    );
};

export default ChangePasswordForm;
