import { SNS } from 'aws-sdk';
import { CREATE_PRODUCT_TOPIC_ARN, PRODUCTS_TABLE } from '@config/sls';
import { StockService } from '@services/stocks';
import { BaseService } from '@services/BaseService';
import { Product } from '@models/models.types';
import { DBError } from '@errors/DBError';
import { UUID } from '@typings/BaseModel';
import { ProductDB } from '@typings/DynamoDB.types';

export class ProductService extends BaseService<ProductDB> {
  private _stockService: StockService;
  constructor() {
    super(PRODUCTS_TABLE);

    this._stockService = new StockService();
  }

  async postCreate(newProduct: ProductDB) {
    await this._stockService.create({
      productId: newProduct.id,
      count: 0,
    });

    return newProduct;
  }

  async findAllWithStock(): Promise<Product[]> {
    const products = await this.findAll();

    const productPromises = products.map(product => {
      return new Promise<Product>(async resolve => {
        let count = 0;

        try {
          const stock = await this._stockService.findById(product.id);

          count = stock.count;
        } catch (error) {
          console.error(`[ProductService|findAllWithStock|stock_error]`, error);
          console.log('get stock error', error);
        }

        resolve({
          ...product,
          count,
        });
      });
    });

    return Promise.all(productPromises);
  }

  async findByIdWithStock(id: UUID) {
    try {
      let count = 0;
      const product = await this.findById(id);
      console.log('product', product);
      if (product?.id) {
        const stock = await this._stockService.findById(product?.id);
        count = stock?.count ?? 0;
      }

      return {
        ...product,
        count,
      };
    } catch (error) {
      console.error(`[ProductService|findByIdWithStock]`, error);
      throw new DBError(`[findByIdWithStock Error]: ${error?.message}`);
    }
  }

  async publishProducts(products) {
    return new Promise(() => {
      const sns = new SNS();
      const maxPrice = Math.max(...products.map(p => p.price));

      console.log('publishProducts products', products);
      console.log('publishProducts maxPrice', maxPrice);

      const params = {
        Subject: 'Products created',
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: `${maxPrice}`
          }
        },
        Message: JSON.stringify(products),
        TopicArn: CREATE_PRODUCT_TOPIC_ARN
      }

      console.log('publishProducts params', params);

      sns.publish(params, (error, response) => {
        if (error) {
          console.log('publishProducts function invoked with ERROR: ', error);
          throw new Error(error.message);
        } else {
          console.log('publishProducts func invoke SUCCESSFULLY with DATA:', response);
        }
      });
    });
  };
}
