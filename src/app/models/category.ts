import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  products?: Product[];
}
