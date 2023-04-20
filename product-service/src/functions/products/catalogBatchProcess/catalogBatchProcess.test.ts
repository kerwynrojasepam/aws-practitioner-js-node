import lambdaTester from 'lambda-tester';
import { mocked } from 'jest-mock';
import { ErrorMessage } from '@constants/errors';
import { ProductService } from '@services/products/ProductService';
// import products from '@mocks/products.json';
import { catalogBatchProcess } from './catalogBatchProcess';

const product1 = {
  title: 'product-test-1',
  description: 'Product test one',
  price: 123
};
const product2 = {
  title: 'product-test-2',
  description: 'Product test two',
  price: 345
};

const mockDataValid = {
  Records: [{
    body: JSON.stringify(product1)
  }, {
    body: JSON.stringify(product2)
  }]
};

const mockDataInvalid = {
  Records: []
};

ProductService.prototype.publishProducts = jest.fn();
const productServiceMock = mocked(new ProductService());

describe('catalogBatchProcess', () => {
  it('should return type of function', () => {
    expect(typeof catalogBatchProcess).toBe('function');
  });

  it('should return statusCode 200', async () => {
    await lambdaTester(catalogBatchProcess)
      .event(mockDataValid as any)
      .expectResult(result => {
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe({
          message: 'catalogBatchProcess: Finished successfully.'
        });
      });
    expect(productServiceMock.publishProducts).toBeCalledWith([product1, product2]);
  });

  it('should not statusCode 500', async () => {
    await lambdaTester(catalogBatchProcess)
      .event(mockDataInvalid as any)
      .expectResult(result => {
        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(
          JSON.stringify({ message: ErrorMessage.PRODUCTS_NOT_FOUND })
        );
      });

    expect(productServiceMock.publishProducts).not.toBeCalled();
  });
});
