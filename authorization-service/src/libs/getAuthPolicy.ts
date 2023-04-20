import { PolicyEffect } from '@constants/Policy';

export const getAuthPolicy = (
  principalId: string,
  effect: PolicyEffect,
  resource: string
) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
