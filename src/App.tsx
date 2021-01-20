import * as React from "react";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { QueryClient, QueryClientProvider } from "react-query";

import TweetCard from "./components/TweetCard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  }
});

type Props = {
  className?: string;
};

const App = styled(({ className }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Global
        styles={css`
          body {
            background-color: hsla(203, 33%, 86%, 0.6);
          }
        `}
      />
      <div className={className}>
        <TweetCard></TweetCard>
      </div>
    </QueryClientProvider>
  );
})`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default App;
