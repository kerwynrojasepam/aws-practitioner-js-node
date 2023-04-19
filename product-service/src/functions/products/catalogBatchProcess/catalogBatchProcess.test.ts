it.todo('catalogBatchProcess tests');

// import lambdaTester from 'lambda-tester';
// import { mocked } from 'jest-mock';
// import { ErrorMessage } from '@constants/errors';
// import { ProductService } from '@services/products/ProductService';
// import products from '@mocks/products.json';
// import { getProductsList } from './getProductsList';

// ProductService.prototype.findAll = jest.fn();
// const productServiceMock = mocked(new ProductService());

// describe('getProductsList', () => {
//   it('should return type of function', () => {
//     expect(typeof getProductsList).toBe('function');
//   });

//   it('should return products and statusCode 200', async () => {
//     await productServiceMock.findAll.mockResolvedValue(products);
//     await lambdaTester(getProductsList).expectResult(result => {
//       expect(result.statusCode).toBe(200);
//       expect(result.body).toBe(JSON.stringify(products));
//     });
//   });

//   it('should not return products and statusCode 500', async () => {
//     await productServiceMock.findAll.mockResolvedValue([]);
//     await lambdaTester(getProductsList).expectResult(result => {
//       expect(result.statusCode).toBe(500);
//       expect(result.body).toBe(
//         JSON.stringify({ message: ErrorMessage.PRODUCTS_NOT_FOUND })
//       );
//     });
//   });

//   it('should return Internal Server Error', async () => {
//     await productServiceMock.findAll.mockRejectedValue({});
//     await lambdaTester(getProductsList).expectResult(result => {
//       expect(result.statusCode).toBe(500);
//       expect(result.body).toBe(
//         JSON.stringify({ message: ErrorMessage.SERVER_ERROR })
//       );
//     });
//   });
// });
