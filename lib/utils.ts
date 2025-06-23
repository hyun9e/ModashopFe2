export const incentives = [
  {
    name: "Free Shipping",
    description:
      "Our shipping is completely free and that is completely good for our customers.",
    imageSrc: "/shipping icon.png",
  },
  {
    name: "24/7 Customer Support",
    description:
      "Our support is working all day and night to answer any question you have.",
    imageSrc: "/support icon.png",
  },
  {
    name: "Fast Shopping Cart",
    description:
      "We have super fast shopping experience and you will enjoy it.",
    imageSrc: "/fast shopping icon.png",
  },
];

export const navigation = {
  sale: [
    { name: "Khuyến mãi", href: "#" },
    { name: "Bộ sưu tập mới", href: "#" },
    { name: "Đăng ký nhận ưu đãi", href: "#" },
  ],
  about: [
    { name: "Về MODA Shop", href: "#" },
    { name: "Tuyển dụng", href: "#" },
    { name: "Hồ sơ công ty", href: "#" },
  ],
  buy: [
    { name: "Thẻ thành viên MODA", href: "#" },
    { name: "Điều khoản sử dụng", href: "#" },
    { name: "Chính sách bảo mật", href: "#" },
    { name: "Khiếu nại & Đối tác", href: "#" },
    { name: "Đối tác & Nhà cung cấp", href: "#" },
  ],
  help: [
    { name: "Liên hệ", href: "#" },
    { name: "Hướng dẫn mua hàng", href: "#" },
    { name: "Câu hỏi thường gặp (FAQ)", href: "#" },
  ],
};

export const isValidNameOrLastname = (input: string) => {
  // Simple name or lastname regex format check
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(input);
};

export const isValidEmailAddressFormat = (input: string) => {
  // simple email address format check
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(input);
};

export const isValidCardNumber = (input: string) => {
  // Remove all non-digit characters
  const cleanedInput = input.replace(/[^0-9]/g, "");
  // test for credit card number between 13 and 19 characters
  const regex = /^\d{13,19}$/;
  return regex.test(cleanedInput);
}

export const isValidCreditCardExpirationDate = (input: string) => {
  // simple expiration date format check
  const regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  return regex.test(input);
};

export const isValidCreditCardCVVOrCVC = (input: string) => {
  // simple CVV or CVC format check
  const regex = /^[0-9]{3,4}$/;
  return regex.test(input);
};

export async function getCategoryMenuList() {
  try {
    const res = await fetch("https://midge-amused-newly.ngrok-free.app/categories", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      title: item.name,
      src: item.imageUrl || "/default-category.png", // fallback nếu không có ảnh
      href: `/shop/${item.name.replace(/\s+/g, '-').toLowerCase()}`
    }));
  } catch (e) {
    return [];
  }
}
