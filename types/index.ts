export interface Product {

  id: string;

  slug: string;

  name: string;

  price: number;

  image: string;

  description: string;

  category: string;

  stock: number;

  featured?: boolean;
}
