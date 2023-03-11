import lambdaTester from 'lambda-tester';
import { mocked } from 'jest-mock';
import { ErrorMessage } from '@constants/errors';
import { ProductService } from '@services/products/ProductService';
import { EventParams } from '@typings/APIGateway.types';
import products from '@mocks/products.json';
import { getProductsById } from './getProductsById';

const defaultEvent: EventParams<{ pathParameters: { id: string } }> = {
  httpMethod: 'post',
  headers: { Authorization: 'dummyToken' },
  isBase64Encoded: false,
  path: '/change-expiry-elapsed-days',
  multiValueQueryStringParameters: null,
  multiValueHeaders: null,
  pathParameters: null,
  queryStringParameters: null,
  stageVariables: null,
  requestContext: null,
  resource: '',
  body: null,
};

describe.only('getProductsById', () => {
  const product = products[0];

  ProductService.prototype.findById = jest.fn();
  const productServiceMock = mocked(new ProductService());

  it('should return type of function', () => {
    expect(typeof getProductsById).toBe('function');
  });

  it('should return product and statusCode 200', async () => {
    await productServiceMock.findById.mockResolvedValue(product);
    await lambdaTester(getProductsById)
      .event({ ...defaultEvent, pathParameters: { id: product.id } } as any)
      .expectResult(result => {
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify(product));
      });
  });

  it('should return error when product not found and statusCode 500', async () => {
    await productServiceMock.findById.mockResolvedValue(undefined);
    await lambdaTester(getProductsById)
      .event({ ...defaultEvent, pathParameters: { id: product.id } } as any)
      .expectResult(result => {
        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(
          JSON.stringify({ message: ErrorMessage.PRODUCT_NOT_FOUND })
        );
      });
  });

  it('should return Internal Server Error', async () => {
    await productServiceMock.findById.mockRejectedValue(undefined);
    await lambdaTester(getProductsById)
      .event({ ...defaultEvent, pathParameters: { id: product.id } } as any)
      .expectResult(result => {
        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(
          JSON.stringify({ message: ErrorMessage.SERVER_ERROR })
        );
      });
  });
});
