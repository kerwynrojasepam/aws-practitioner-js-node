// import { createHandler, handlerPath } from '@libs/handler-resolver';
// import { GetProductsListSchema } from './types';

export { getProductsList } from './getProductsList/getProductsList';
export { getProductsById } from './getProductsById';

// export const getProductsList = createHandler({
//   handler: getProductsListHandler as any,
//   method: 'get',
//   path: 'products',
//   schema: GetProductsListSchema,
// });
