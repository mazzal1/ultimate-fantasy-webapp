import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

let configured = false;

const authModeMap = {
  AMAZON_COGNITO_USER_POOLS: 'userPool',
  API_KEY: 'apiKey',
} as const;

export function configureAmplify() {
  if (configured) {
    return;
  }

  const endpoint = import.meta.env.VITE_APPSYNC_GRAPHQL_ENDPOINT;
  const region = import.meta.env.VITE_AWS_REGION;
  const authType = import.meta.env.VITE_APPSYNC_AUTH_TYPE;
  const defaultAuthMode = authModeMap[authType as keyof typeof authModeMap] ?? 'userPool';
  const apiKey = import.meta.env.VITE_APPSYNC_API_KEY;
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;

  if (!endpoint || !region) {
    configured = true;
    return;
  }

  if (defaultAuthMode === 'apiKey' && !apiKey) {
    configured = true;
    return;
  }

  if (defaultAuthMode === 'userPool' && (!userPoolId || !userPoolClientId)) {
    configured = true;
    return;
  }

  const authConfig =
    userPoolId && userPoolClientId
      ? {
          Auth: {
            Cognito: {
              userPoolId,
              userPoolClientId,
            },
          },
        }
      : {};

  Amplify.configure({
    ...authConfig,
    API: {
      GraphQL: {
        endpoint,
        region,
        defaultAuthMode,
        ...(defaultAuthMode === 'apiKey' ? { apiKey } : {}),
      },
    },
  });

  configured = true;
}

export function createGraphqlClient() {
  configureAmplify();
  return generateClient();
}
