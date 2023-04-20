import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';
import stripBom from 'strip-bom-stream';

import { S3_FOLDERS } from '@constants/folders';
import { formatJSONResponse } from '@libs/api-gateway';
import { getS3Client } from '@services/S3Client';
import { ErrorMessage } from '@constants/errors';
import { sendMessageToSQS } from '@libs/sendMessageToSQS';

const createReadableStream = async (s3Client: S3, params: any) => {
  return new Promise<void>(async (resolve, reject) => {
    const object = await s3Client.getObject(params);
    const products = [];
    const sqs = new SQS({ apiVersion: '2012-11-05' });

    const fileStream = await object.createReadStream();

    fileStream
      .pipe(stripBom())
      .pipe(csv())
      .on('data', async product => {
        console.log('product', { product });
        products.push(product);

        console.log('[createReadableStream] CSV parsed file record', product);
        const sqsResponse = await sendMessageToSQS(sqs, product);
        console.log('sqsResponse', sqsResponse);
      })
      .on('end', () => {
        console.log('createReadStream END', products);
        resolve();
      })
      .on('error', error => {
        console.log('createReadStream ERROR', error);
        reject();
      });
  });
};

export const importFileParser = async event => {
  console.log('importFileParser-basicAuthorizer', event);
  const records = event?.Records;
  const s3Client = getS3Client();

  try {
    for (const record of records) {
      const recordBucketName = record.s3.bucket.name;
      const objectKey = record.s3.object.key;

      const params = {
        Bucket: recordBucketName,
        Key: objectKey,
      };

      await createReadableStream(s3Client, params);

      await s3Client
        .copyObject({
          ...params,
          CopySource: `${recordBucketName}/${objectKey}`,
          Key: objectKey.replace(S3_FOLDERS.UPLOADED, S3_FOLDERS.PARSED),
        })
        .promise();

      await s3Client.deleteObject(params).promise();
    }

    const response = {
      message: `S3 Objects successfully moved from '${S3_FOLDERS.UPLOADED}' to '${S3_FOLDERS.PARSED}'`,
    };

    console.log('importFileParser-success', response);
    return formatJSONResponse(response, 200);
  } catch (error) {
    console.log('importFileParser', error);
    console.error('importFileParser', error);
    return formatJSONResponse({
      message: ErrorMessage.SERVER_ERROR,
    });
  }
};
