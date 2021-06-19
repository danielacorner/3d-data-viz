import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

const QueryClientProviderWithClient = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryClientProviderWithClient;
