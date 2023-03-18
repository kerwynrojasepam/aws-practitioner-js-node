import AWS from 'aws-sdk';
import { BUCKET_REGION } from '@config/sls';

export const getS3Client = () => new AWS.S3({ region: BUCKET_REGION });
