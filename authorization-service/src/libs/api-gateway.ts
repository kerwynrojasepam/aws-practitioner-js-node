import { HEADERS } from '@constants/headers';

export const formatJSONResponse = <T>(response: T, statusCode = 500) => {
  return {
    headers: HEADERS,
    statusCode,
    body: JSON.stringify(response),
  };
};
