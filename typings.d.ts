interface Product {
  id: string | number;
  slug: string | number;
  title: string;
  price: number;
  rating: number;
  description: string;
  mainImage: string;
  manufacturer?: string;
  categoryId?: string | number;
  category?: { name: string } | string;
  inStock?: number;
  discount?: number;
}

interface SingleProductPageProps {
  params: {
    productSlug: string;
  };
}

type ProductInWishlist = {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
};

interface OtherImages {
  imageID: number;
  productID: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  password: string | null;
  role: string;
}

interface Order {
  id: string;
  adress: string;
  apartment: string;
  company: string;
  dateTime: string;
  email: string;
  lastname: string;
  name: string;
  phone: string;
  postalCode: string;
  status: "processing" | "canceled" | "delivered";
  city: string;
  country: string;
  orderNotice: string?;
  total: number;
}

interface SingleProductBtnProps {
  product: Product;
  quantityCount: number;
}


interface Category {
  id: string;
  name: string;
}

interface WishListItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}