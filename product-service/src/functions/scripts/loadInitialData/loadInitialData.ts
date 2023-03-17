import { ProductService } from '@services/products/ProductService';
import { formatJSONResponse } from '@libs/api-gateway';
import mockProductsData from '@mocks/products.json';

export const loadInitialData = async () => {
  console.log('loadInitialData');
  const productsService = new ProductService();

  const productsHasData = await productsService.hasData();

  if (productsHasData) {
    return formatJSONResponse({
      message: `Initial load can't run when there is data already`,
    });
  }

  try {
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockProductsData.map(({ count, ...item }) => productsService.create(item))
    );

    return formatJSONResponse({ message: `Initial load finished` }, 200);
  } catch (error) {
    console.error('loadInitialData', error);
    return formatJSONResponse({
      message: `Initial load error`,
      error,
    });
  }
};

export default loadInitialData;
