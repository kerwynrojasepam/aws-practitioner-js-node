import csv from 'csv-parser';

import { S3_FOLDERS } from '@constants/folders';
import { formatJSONResponse } from '@libs/api-gateway';
import { getS3Client } from '@services/S3Client';
import { ErrorMessage } from '@constants/errors';

export const importFileParser = async event => {
  console.log('importFileParser', event);
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

      const object = await s3Client.getObject(params);

      object.createReadStream().pipe(csv()).on('data', console.log);

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
