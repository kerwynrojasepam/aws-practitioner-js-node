// import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import type { FromSchema } from 'json-schema-to-ts';
import { HEADERS } from '@constants/headers';
import type { Handler, Params } from '@types/APIGateway.types';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

// type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
//   body: FromSchema<S>;
// };
// export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
//   ValidatedAPIGatewayProxyEvent<S>,
//   APIGatewayProxyResult
// >;

export const formatJSONResponse = <T>(response: T, statusCode = 500) => {
  return {
    headers: HEADERS,
    statusCode,
    body: JSON.stringify(response),
  };
};

export function createAPIGatewayProxyHandler<
  P extends Params<Record<string, unknown>>
>(handler: Handler<P>) {
  return middy(handler).use(middyJsonBodyParser());
}
