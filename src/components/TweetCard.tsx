import React, { useEffect } from "react";
import styled from "@emotion/styled";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import useBumbleApi from "../hooks/useBumbleApi";

type Props = {
  className?: string;
};

const TweetCard = styled(({ className }: Props) => {
  const { tweets, isLoading, isLive, setIsLive, fetchOlder } = useBumbleApi();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.innerHeight >= document.body.offsetHeight) {
        setIsLive(false);
        fetchOlder();
      }
      
    });
  }, [setIsLive, fetchOlder]);

  if (isLoading) return <CircularProgress />;

  return (
    <>
      {tweets.map(({ id, username, image, text }) => (
        <Card key={id} className={className}>
          <CardHeader
            avatar={<Avatar alt={username} src={image} />}
            title={username}
          />
          <CardContent>
            <Typography variant="body1">{text}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
})`
  margin: 10px;
  width: 500px;
`;

export default TweetCard;
