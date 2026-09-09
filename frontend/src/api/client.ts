import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

let configured = false;

export function configureAmplify() {
  if (configured) {
    return;
  }

  const endpoint = import.meta.env.VITE_APPSYNC_GRAPHQL_ENDPOINT;
  const region = import.meta.env.VITE_AWS_REGION;
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;

  if (!endpoint || !region || !userPoolId || !userPoolClientId) {
    configured = true;
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
    API: {
      GraphQL: {
        endpoint,
        region,
        defaultAuthMode: 'userPool',
      },
    },
  });

  configured = true;
}

export function createGraphqlClient() {
  configureAmplify();
  return generateClient();
}
