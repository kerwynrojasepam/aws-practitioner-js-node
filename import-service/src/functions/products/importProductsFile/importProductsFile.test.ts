import * as AWSMock from 'jest-aws-sdk-mock';
import AWS from 'aws-sdk';
import lambdaTester from 'lambda-tester';

import { importProductsFile } from '@functions/products/importProductsFile';
import { ErrorMessage } from '@constants/errors';
import { EventParams } from '@typings/APIGateway.types';

AWSMock.setSDKInstance(AWS);

jest.mock('@config/sls', () => ({
  BUCKET_NAME: 'TEST_BUCKET_NAME',
}));

const defaultEvent: EventParams<{ pathParameters: { id: string } }> = {
  httpMethod: 'get',
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

describe.only('importProductsFile', () => {
  const url = 'test_url';
  AWSMock.mock('S3', 'getSignedUrl', (_action, _params, callback) => {
    callback(null, url);
  });

  test('should return valid url and status 200', async () => {
    await lambdaTester(importProductsFile)
      .event({
        ...defaultEvent,
        queryStringParameters: { name: 'mock_test_file' },
      } as any)
      .expectResult(result => {
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(
          JSON.stringify({
            url,
          })
        );
      });
  });

  test('should return error message and status 400', async () => {
    await lambdaTester(importProductsFile)
      .event({
        ...defaultEvent,
        queryStringParameters: {},
      } as any)
      .expectResult(result => {
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe(
          JSON.stringify({
            message: ErrorMessage.FILENAME_NOT_PROVIDED,
          })
        );
      });
  });
});
