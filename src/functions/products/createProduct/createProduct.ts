import { ProductService } from '@services/products/ProductService';
import {
  createAPIGatewayProxyHandler,
  formatJSONResponse,
} from '@libs/api-gateway';
import { ErrorMessage } from '@constants/errors';
import { BodyParams } from '@typings/APIGateway.types';
import { CreateProductPayload } from '@typings/http.types';

export const createProduct = createAPIGatewayProxyHandler<
  BodyParams<CreateProductPayload>
>(async event => {
  const params = event.body;
  console.log('createProduct', params);

  if (!event.body) {
    return formatJSONResponse({ message: 'Product data not provided' }, 400);
  }

  const productsService = new ProductService();

  try {
    const product = await productsService.create(params);

    if (!product) {
      return formatJSONResponse({
        message: ErrorMessage.PRODUCT_NOT_CREATED,
      });
    }

    return formatJSONResponse(product, 200);
  } catch (error) {
    console.error('createProduct', error);
    return formatJSONResponse({
      message: ErrorMessage.SERVER_ERROR,
    });
  }
});

export default createProduct;
