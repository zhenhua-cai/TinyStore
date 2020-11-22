import {Product} from '../shared/product.model';

export  interface ShoppingCartItem {
  id: string;
  quantity: number;
  subtotal: number;
  product: Product;
}
