import { ProductType } from '@functions/products/types';
import { ProductService } from '@services/products/ProductService';
import {
  createAPIGatewayProxyHandler,
  formatJSONResponse,
} from '@libs/api-gateway';
import { ErrorMessage } from '@constants/errors';
import { PathParams } from '@typings/APIGateway.types';

export const getProductsById = createAPIGatewayProxyHandler<
  PathParams<Pick<ProductType, 'id'>>
>(async event => {
  const paramId = event.pathParameters.id;
  const productsService = new ProductService();

  try {
    const product = await productsService.findById(paramId);

    if (!product) {
      return formatJSONResponse({
        message: ErrorMessage.PRODUCT_NOT_FOUND,
      });
    }

    return formatJSONResponse(product, 200);
  } catch (error) {
    return formatJSONResponse({
      message: ErrorMessage.SERVER_ERROR,
    });
  }
});

export default getProductsById;
