import { RuntimeReactQueryType } from '@umijs/max';

export const reactQuery: RuntimeReactQueryType = {
  devtool: {
    initialIsOpen: true,
  },
  queryClient: {
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 0,
        networkMode: 'always',
        refetchOnWindowFocus: false,
      },
    },
  },
};
