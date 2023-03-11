// import { createHandler, handlerPath } from '@libs/handler-resolver';
// import { GetProductsListSchema } from './types';

export { createProduct } from './createProduct';
export { getProductsList } from './getProductsList';
export { getProductsById } from './getProductsById';

// export const getProductsList = createHandler({
//   handler: getProductsListHandler as any,
//   method: 'get',
//   path: 'products',
//   schema: GetProductsListSchema,
// });
