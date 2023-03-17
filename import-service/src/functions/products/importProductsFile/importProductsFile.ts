import { S3_FOLDERS } from '@constants/folders';
import { BUCKET_NAME } from '@config/sls';
import { s3Client } from '@services/S3Client';
import {
  createAPIGatewayProxyHandler,
  formatJSONResponse,
} from '@libs/api-gateway';
import { ErrorMessage } from '@constants/errors';
import { QueryParams } from '@typings/APIGateway.types';

export const importProductsFile = createAPIGatewayProxyHandler<
  QueryParams<{ name: string }>
>(async event => {
  console.log('importProductsFile', event);

  try {
    const fileName = event.queryStringParameters.name;

    if (!fileName) {
      return formatJSONResponse({ message: 'File name not provided' }, 400);
    }

    const url = await s3Client.getSignedUrlPromise('putObject', {
      Bucket: BUCKET_NAME,
      Key: `${S3_FOLDERS.UPLOADED}/${fileName}`,
      Expires: 60,
      ContentType: 'text/csv',
    });

    if (!url) {
      return formatJSONResponse({
        message: `Failed to retrieve file url from s3 bucket`,
      });
    }

    console.log(`Successfully retrieved url '${url}'`);

    return formatJSONResponse({ url }, 200);
  } catch (error) {
    console.log('importProductsFile', error);
    return formatJSONResponse(
      {
        message: error?.message || ErrorMessage.SERVER_ERROR,
      },
      200
    );
  }
});
