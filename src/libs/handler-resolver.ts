import { FunctionDefinitionHandler } from 'serverless';

export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

type HandlerParams = {
  handler: string;
  method: string;
  path: string;
  schema: Record<string, unknown>;
};

export const createHandler = ({
  handler,
  method,
  path,
  schema,
}: HandlerParams): FunctionDefinitionHandler => {
  console.log('Test2');

  return {
    handler,
    events: [
      {
        http: {
          method,
          path,
          request: {
            schemas: {
              'application/json': schema,
            },
          },
        },
      },
    ],
  };
};
