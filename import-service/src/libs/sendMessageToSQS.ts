import { SQS } from 'aws-sdk';

import { SQS_URL } from '@config/sls';

export const sendMessageToSQS = async (sqs: SQS, messageBody) => {
  const params: SQS.Types.SendMessageRequest = {
    QueueUrl: SQS_URL,
    MessageBody: JSON.stringify(messageBody),
  };

  console.log('sendMessageToSQS-params', params);

  const { $response } = await (sqs.sendMessage(params).promise());

  if ($response.error) {
    console.log('sendMessageToSQS message error', $response.error, messageBody);
    throw new Error($response.error.message);
  }

  console.log('Message has been sent to SQS with result', messageBody, $response.data);
  return $response.data;
};
