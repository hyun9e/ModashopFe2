/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [], // Không giới hạn domain
        domains: [], // Không giới hạn domain
        unoptimized: true, // Cho phép mọi nguồn ảnh, không tối ưu hóa
        dangerouslyAllowSVG: true, // Cho phép SVG từ mọi nguồn (nếu cần)
    },
};

export default nextConfig;
