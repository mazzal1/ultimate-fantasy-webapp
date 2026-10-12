import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createGraphqlClient } from '../api/client';

type GraphqlClient = ReturnType<typeof createGraphqlClient>;

const ApiContext = createContext<{ graphqlClient: GraphqlClient } | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({ graphqlClient: createGraphqlClient() }), []);
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }

  return context;
}
