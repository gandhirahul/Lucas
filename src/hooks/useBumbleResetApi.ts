import { useQuery } from "react-query";

const URL =
  "https://bumble-twitter-interview.herokuapp.com/lucas-caltabiano/reset";

const useBumbleResetApi = () =>
  useQuery(
    "resetDataBase",
    async () =>
      await fetch(URL)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(error);
        }),
    {
      enabled: false
    }
  );

export default useBumbleResetApi;
