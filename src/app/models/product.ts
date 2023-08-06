export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  defaultPrice?: number;
  defaultCost?: number;
}
