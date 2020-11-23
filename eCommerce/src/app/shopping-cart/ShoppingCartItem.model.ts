import {Product} from '../shared/models/product.model';

export  interface ShoppingCartItem {
  id: string;
  quantity: number;
  subtotal: number;
  product: Product;
}
