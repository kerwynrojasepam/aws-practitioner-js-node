import { ProductService } from '@services/products/ProductService';
import { formatJSONResponse } from '@libs/api-gateway';
import { Error } from 'src/constants/errors';

export const getProductsList = async () => {
  const productsService = new ProductService();

  try {
    const products = await productsService.findAll();

    if (!products.length) {
      return formatJSONResponse({
        body: {
          message: Error.PRODUCTS_NOT_FOUND,
        },
      });
    }

    return formatJSONResponse(products, 200);
  } catch (error) {
    return formatJSONResponse({
      body: {
        message: Error.SERVER_ERROR,
      },
    });
  }
};

export default getProductsList;
