import { ProductType } from '@functions/products/types';
import { BaseService } from '@services/BaseService/BaseService';

import mockProductsData from '@mocks/products.json';

export class ProductService extends BaseService<ProductType> {
  constructor() {
    super(mockProductsData);
  }
}
