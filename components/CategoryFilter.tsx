// *********************
// Role of the component: Category filter for shop page
// Name of the component: CategoryFilter.tsx
// Developer: GitHub Copilot
// *********************

"use client";
import React, { useEffect, useState } from "react";

interface Category {
    id: number;
    name: string;
    imageUrl: string;
}

interface CategoryFilterProps {
    baseUrl: string;
    onChange: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ baseUrl, onChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`${baseUrl}/categories`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .finally(() => setLoading(false));
    }, [baseUrl]);

    const handleChange = (id: number | null) => {
        setSelected(id);
        onChange(id);
    };

    return (
        <div className="mb-4">
            <h3 className="text-xl mb-2">Danh mục sản phẩm</h3>
            {loading ? (
                <div>Đang tải danh mục...</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-3 py-1 rounded border ${selected === null ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                        onClick={() => handleChange(null)}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`px-3 py-1 rounded border ${selected === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                            onClick={() => handleChange(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;
