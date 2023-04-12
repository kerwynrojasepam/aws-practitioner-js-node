import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import inputOutputLogger from '@middy/input-output-logger';

export const middyfy = handler => {
  return middy(handler)
    .use(cors())
    .use(middyJsonBodyParser())
    .use(
      inputOutputLogger({
        logger: data => {
          console.log('[IO Log]:', data);
        },
      })
    );
};
