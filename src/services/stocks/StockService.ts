import { STOCKS_TABLE } from '@config/sls';
import { BaseService } from '@services/BaseService/BaseService';
import { StockDB } from '@typings/DynamoDB.types';

export class StockService extends BaseService<StockDB> {
  constructor() {
    super(STOCKS_TABLE, 'productId');
  }
}
