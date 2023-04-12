import { Product } from '@models/models.types';
import { ProductService } from '@services/products/ProductService';
import {
  createAPIGatewayProxyHandler,
  formatJSONResponse,
} from '@libs/api-gateway';
import { ErrorMessage } from '@constants/errors';
import { PathParams } from '@typings/APIGateway.types';

export const getProductsById = createAPIGatewayProxyHandler<
  PathParams<Pick<Product, 'id'>>
>(async event => {
  const paramId = event.pathParameters.id;
  console.log('getProductsById', paramId);
  const productsService = new ProductService();

  try {
    const product = await productsService.findByIdWithStock(paramId);

    if (!product) {
      return formatJSONResponse({
        message: ErrorMessage.PRODUCT_NOT_FOUND,
      });
    }

    return formatJSONResponse(product, 200);
  } catch (error) {
    console.error('getProductsById', error);
    return formatJSONResponse({
      message: ErrorMessage.SERVER_ERROR,
    });
  }
});

export default getProductsById;
