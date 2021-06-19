import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const QueryClientProviderWithClient = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryClientProviderWithClient;
