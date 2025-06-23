import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export type State = {
  cartItems: CartItem[];
  allQuantity: number;
  total: number;
};

export type Actions = {
  setCartFromApi: (items: CartItem[]) => void;
  clearCart: () => void;
  removeFromCart: (id: string) => void;
  addToCart: (item: CartItem) => void;
  updateCartAmount: (id: string, quantity: number) => void;
};

export const useCartStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      cartItems: [],
      allQuantity: 0,
      total: 0,
      setCartFromApi: (items) => {
        // Gộp các item trùng nhau
        const merged: CartItem[] = [];
        items.forEach((item) => {
          const found = merged.find(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color
          );
          if (found) {
            found.quantity += item.quantity;
          } else {
            merged.push({ ...item });
          }
        });
        let amount = 0;
        let total = 0;
        merged.forEach((item) => {
          amount += item.quantity;
          total += item.quantity * item.price;
        });
        set(() => ({
          cartItems: merged,
          allQuantity: amount,
          total: total,
        }));
      },
      clearCart: () => {
        set(() => ({ cartItems: [], allQuantity: 0, total: 0 }));
      },
      addToCart: (item) => {
        // Nếu thiếu size/color/quantity thì không cho thêm vào cart (bắt buộc phải chọn biến thể)
        if (!item.size || !item.color || !item.quantity) {
          alert('Vui lòng chọn đầy đủ size, màu sắc và số lượng trước khi thêm vào giỏ hàng!');
          return;
        }
        const itemWithDefaults = {
          ...item,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        };
        set((state) => {
          const found = state.cartItems.find((i) => i.productId === itemWithDefaults.productId && i.size === itemWithDefaults.size && i.color === itemWithDefaults.color);
          let newCart;
          if (found) {
            newCart = state.cartItems.map((i) =>
              i.productId === itemWithDefaults.productId && i.size === itemWithDefaults.size && i.color === itemWithDefaults.color
                ? { ...i, quantity: i.quantity + itemWithDefaults.quantity }
                : i
            );
          } else {
            newCart = [...state.cartItems, itemWithDefaults];
          }
          let amount = 0;
          let total = 0;
          newCart.forEach((i) => {
            amount += i.quantity;
            total += i.quantity * i.price;
          });
          return { cartItems: newCart, allQuantity: amount, total };
        });
        // Đồng bộ API sau khi set local
        if (typeof window !== "undefined") {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            let apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
            apiUrl = apiUrl.replace(/\/products$/, "");
            // Gọi API thêm mới item vào cart: POST /cart/:cartId với body là item
            const cartId = user.cartId || user.id;
            fetch(`${apiUrl}/cart/${cartId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                productId: itemWithDefaults.productId,
                size: itemWithDefaults.size,
                color: itemWithDefaults.color,
                quantity: itemWithDefaults.quantity
              })
            });
          }
        }
      },
      removeFromCart: (itemId) => {
        set((state) => {
          const newCart = state.cartItems.filter((i) => i.id !== itemId);
          let amount = 0;
          let total = 0;
          newCart.forEach((i) => {
            amount += i.quantity;
            total += i.quantity * i.price;
          });
          // Đồng bộ API sau khi set local
          if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const user = JSON.parse(userStr);
              let apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
              apiUrl = apiUrl.replace(/\/products$/, "");
              // Lấy cartId từ cartItems (giả sử tất cả item cùng cartId, lấy từ item đầu tiên)
              const cartId = state.cartItems[0]?.cartId || user.cartId || user.id;
              // Gọi API xóa item khỏi cart
              fetch(`${apiUrl}/cart/${cartId}/${itemId}`, {
                method: "DELETE",
                headers: {
                  'ngrok-skip-browser-warning': 'true',
                  'Accept': 'application/json'
                }
              });
            }
          }
          return { cartItems: newCart, allQuantity: amount, total };
        });
      },
      updateCartAmount: (id, quantity) => {
        set((state) => {
          const newCart = state.cartItems.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );
          let amount = 0;
          let total = 0;
          newCart.forEach((i) => {
            amount += i.quantity;
            total += i.quantity * i.price;
          });
          return { cartItems: newCart, allQuantity: amount, total };
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// --- API đồng bộ cart với user đăng nhập ---
import { useEffect } from "react";

export const useSyncCartWithApi = (userId: string | number | undefined, setCartFromApi: (items: any[]) => void) => {
  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://midge-amused-newly.ngrok-free.app";
        const res = await fetch(`${apiUrl}/cart/${userId}`);
        if (res.ok) {
          const cart = await res.json();
          setCartFromApi(cart.items || []);
        }
      } catch (e) {
        // silent
      }
    };
    fetchCart();
  }, [userId, setCartFromApi]);
};
