import { useState } from "react";
import { useQuery } from "react-query";
import useBumbleResetApi from "./useBumbleResetApi";

const INTERVAL = 2000;
const MAX_TWEETS = 10000; // 10001 is the latest id
const URL =
  "https://bumble-twitter-interview.herokuapp.com/lucas-caltabiano/api?count=5";

const useBumbleApi = () => {
  const [lastId, setLastId] = useState(null);
  const [tweets, setTweets] = useState<any>([]);
  const { refetch: resetDatabase } = useBumbleResetApi();

  const queryParams = lastId ? `&afterId=${lastId}` : "";

  const resetData = async () => {
    await resetDatabase();

    setTimeout(() => {
      setTweets([]);
      setLastId(null);
    }, INTERVAL);
  };

  const { isLoading, refetch } = useQuery(
    ["fetchTweets", lastId],
    async () =>
      await fetch(`${URL}${queryParams}`)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(error);
        }),
    {
      retry: true,
      keepPreviousData: true,
      onSuccess: async (data) => {
        if (data.length) {
          const [{ id: latestId }] = data;

          setTweets([...data, ...tweets]);

          if (latestId > MAX_TWEETS) {
            return resetData();
          }

          return setTimeout(() => {
            setLastId(latestId);
          }, INTERVAL);
        }

        // in case of no new tweets, just refetch from last known id
        refetch();
      }
    }
  );

  return {
    tweets,
    isLoading
  };
};

export default useBumbleApi;
