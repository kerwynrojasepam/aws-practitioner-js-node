import { APIGatewayAuthorizerEvent, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { ErrorMessage } from '@constants/errors';
import { isUserAuthorized } from '@config/sls';
import { getAuthPolicy } from '@libs/getAuthPolicy';
import { PolicyEffect } from '@constants/Policy';

const getCredentials = (authToken: string) => {
  const credentials = authToken.split(' ')[1];
  const encoded = Buffer.from(credentials, 'base64');
  const [userName, password] = encoded.toString('utf-8').split(':');

  console.log('basicAuthorizer-getCredentials', { credentials, userName, password });

  return {
    credentials,
    userName,
    password
  };
};

export const basicAuthorizer = async (event: APIGatewayAuthorizerEvent) => {
  console.log('basicAuthorizer', JSON.stringify(event));

  try {
    if (event.type !== 'TOKEN') {
      return formatJSONResponse({ message: ErrorMessage.FORBIDDEN }, 403);
    }

    const { authorizationToken, methodArn } = event as APIGatewayTokenAuthorizerEvent;

    if (!authorizationToken) {
      return formatJSONResponse({
        message: ErrorMessage.NO_AUTH_TOKEN_PROVIDED,
      }, 401);
    }

    const { credentials, userName, password } = getCredentials(authorizationToken);

    const isAuthorized = isUserAuthorized(userName, password);

    if (!isAuthorized) {
      return formatJSONResponse({ message: ErrorMessage.FORBIDDEN }, 403);
    }

    const policy = isAuthorized
        ? getAuthPolicy(credentials, PolicyEffect.ALLOW, methodArn)
        : getAuthPolicy(credentials, PolicyEffect.DENY, methodArn);

    console.log('basicAuthorizer-policy', policy);

    return policy;
  } catch (error) {
    console.log('basicAuthorizer-error', error);
    return formatJSONResponse({
      message: `${ErrorMessage.SERVER_ERROR} - ${error}`,
    });
  }
};

export default basicAuthorizer;
