import { ProductType } from '@functions/products/types';
import { ProductService } from '@services/products/ProductService';
import {
  createAPIGatewayProxyHandler,
  formatJSONResponse,
} from '@libs/api-gateway';
import { Error } from 'src/constants/errors';
import { PathParams } from '@types/APIGateway.types';

export const getProductById = createAPIGatewayProxyHandler<
  PathParams<Pick<ProductType, 'id'>>
>(async event => {
  const paramId = event.pathParameters.id;
  const productsService = new ProductService();

  try {
    const product = await productsService.findById(paramId);

    if (!product) {
      return formatJSONResponse({
        body: {
          message: Error.PRODUCT_NOT_FOUND,
        },
      });
    }

    return formatJSONResponse(product, 200);
  } catch (error) {
    return formatJSONResponse({
      body: {
        message: Error.SERVER_ERROR,
      },
    });
  }
});

export default getProductById;
