export interface Product {
  id: string;
  title: string;
  count: number;
  price: number;
  description: string;
}

export interface Stock {
  productId: string;
  count: number;
}
