import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';

export interface Result extends Omit<APIGatewayProxyResult, 'body'> {
  body: Record<string, unknown>;
}

export interface BodyParams<P extends Record<string, unknown>> {
  body: P;
}

export interface QueryParams<P extends Record<string, unknown>> {
  queryStringParameters: P;
}

export interface PathParams<P extends Record<string, unknown>> {
  pathParameters: P;
}

export type Params<P extends Record<string, unknown>> =
  | BodyParams<P>
  | QueryParams<P>
  | PathParams<P>;

interface EventParams<EP extends Params<Record<string, unknown>>>
  extends Omit<
    APIGatewayProxyEvent,
    'body' | 'pathParameters' | 'queryStringParameters'
  > {
  body: EP extends BodyParams<Record<string, unknown>> ? EP['body'] : null;
  pathParameters: EP extends PathParams<Record<string, unknown>>
    ? EP['pathParameters']
    : null;
  queryStringParameters: EP extends QueryParams<Record<string, unknown>>
    ? EP['queryStringParameters']
    : null;
}

export type Handler<P extends Params<Record<string, unknown>>> = (
  event: EventParams<P>,
  context: Context,
  callback: Callback<Result>
) => void | Promise<Result>;
