import { ProductService } from '@services/products';
import { formatJSONResponse } from '@libs/api-gateway';
import { ErrorMessage } from '@constants/errors';
import { SQSEvent } from 'aws-lambda';

export const catalogBatchProcess = (async (event: SQSEvent) => {
  const productsService = new ProductService();

  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));

    if (!products.length) {
      return formatJSONResponse({
        message: ErrorMessage.PRODUCTS_NOT_FOUND,
      });
    }

    await Promise.all(
      products.map(({ count, ...item }) => productsService.create(item))
    );

    await productsService.publishProducts(products);

    return formatJSONResponse({
      message: 'catalogBatchProcess: Finished successfully.'
    }, 200);
  } catch (error) {
    console.error('catalogBatchProcess', error);
    return formatJSONResponse({ message: error.message });
  }
});

export default catalogBatchProcess;
