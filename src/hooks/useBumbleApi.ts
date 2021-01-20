import { useState } from "react";
import { useQuery } from "react-query";
import useBumbleResetApi from "./useBumbleResetApi";

const INTERVAL = 2000;
const MAX_TWEETS = 10000; // 10001 is the latest id
const URL =
  "https://bumble-twitter-interview.herokuapp.com/lucas-caltabiano/api?count=10";

const useBumbleApi = () => {
  const [lastId, setLastId] = useState(null);
  const [lastFetchedId, setLastFetchedId] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [tweets, setTweets] = useState<any>([]);
  const [lastBeforeId, setLastBeforeId] = useState(null);
  const { refetch: resetDatabase } = useBumbleResetApi();

  const liveQueryParams = lastId ? `&afterId=${lastId}` : "";
  const olderQueryParams = `&beforeId=${lastBeforeId}`;

  const resetData = async () => {
    await resetDatabase();

    setTimeout(() => {
      setTweets([]);
      setLastId(null);
    }, INTERVAL);
  };

  const fetchOlder = () => {
    return setLastBeforeId(tweets[tweets.length - 1].id);
  };

  const { data: olderTweets } = useQuery(
    ["fetchOlder", lastBeforeId],
    async () => {
      await fetch(`${URL}${olderQueryParams}`)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(error);
        });
    },
    {
      enabled: false,
      onSuccess: (data) => {
        setTweets([...tweets, ...data]);
      }
    }
  );

  const goLive = () => {
    setTimeout(() => {
      setLastFetchedId(lastId);
    }, INTERVAL);
  };

  const { isLoading, refetch } = useQuery(
    ["fetchTweets", lastFetchedId],
    async () =>
      await fetch(`${URL}${liveQueryParams}`)
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

          setLastId(latestId);

          if (isLive) {
            goLive();
          }

          return;
        }

        // in case of no new tweets, just refetch from last known id
        refetch();
      }
    }
  );

  return {
    tweets,
    isLoading,
    isLive,
    setIsLive,
    fetchOlder
  };
};

export default useBumbleApi;
