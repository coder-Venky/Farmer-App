export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  farmer: string;
  unit: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
}

export interface AuthError {
  message: string;
}