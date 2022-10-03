import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { STATUS, TwitterData, useTwitterStats } from "./use-twitter-stats";
import Paper from "@mui/material/Paper";

const showStats = (data: TwitterData) => (
  <>
    <Typography variant="h5">
      Twitter Stats
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Current Hour: Tweets</TableCell>
            <TableCell>{data.countCurrent}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Current Hour: Top Tags</TableCell>
            <TableCell>
              {data.hashtagCurrent.map((t) => <p>`#${t}`</p>)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last 24 Hours: Tweets</TableCell>
            <TableCell>{data.count24}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last 24 Hours: Top Tags</TableCell>
            <TableCell>
              {data.hashtag24.map((t) => <p>`#${t}`</p>)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last 48 Hours: Tweets</TableCell>
            <TableCell>{data.count48}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last 48 Hours: Top Tags</TableCell>
            <TableCell>
              {data.hashtag48.map((t) => <p>`#${t}`</p>)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default () => {
  const { state, reload } = useTwitterStats();

  React.useEffect(() => {
    // don't set unless loaded
    if (state.status !== STATUS.LOADED) {
      return;
    }

    // reload after a minute
    const t = setTimeout(reload, 60000);
    return () => clearTimeout(t);
  });

  switch (state.status) {
    case STATUS.UNLOADED:
    case STATUS.LOADING:
      return <CircularProgress />;
    case STATUS.ERROR:
      return (
        <Box>
          <Typography variant="h3" component="h2" gutterBottom>
            Error Fetching API Data
          </Typography>
          <Typography variant="body1">
            {state.error?.message || "Unexpected Error"}
          </Typography>
          <Button onClick={reload}>Retry</Button>
        </Box>
      );
  }

  const emptyData = {
    countCurrent: 0,
    count24: 0,
    count48: 0,
    hashtagCurrent: [],
    hashtag24: [],
    hashtag48: [],
  };
  return showStats(state.data || emptyData);
};
