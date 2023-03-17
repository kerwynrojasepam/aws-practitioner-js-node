import { S3 } from 'aws-sdk';
import { BUCKET_REGION } from '@config/sls';

export const s3Client = new S3({ region: BUCKET_REGION });
