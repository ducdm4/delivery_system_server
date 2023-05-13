import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [];
  getProduct(): string {
    return 'Hello World!';
  }

  findProductById(id: number): Product {
    return this.products[id];
  }

  addProduct(product: Product) {
    this.products.push(product);
  }
}
