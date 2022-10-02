import { useState, useEffect } from "react";

export interface TwitterData {
  countCurrent: number;
  hashtagCurrent: string[];
  count24: number;
  hashtag24: string[];
  count48: number[];
  hashtag48: string[];
}

export enum STATUS {
  UNLOADED = 0,
  LOADING = 1,
  LOADED = 2,
  ERROR = 3,
}

export interface State {
  status: STATUS;
  data?: TwitterData;
  error?: any;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useTwitterStats = () => {
  const [state, setState] = useState({
    status: STATUS.UNLOADED,
    data: undefined,
    error: undefined,
  } as State);

  useEffect(() => {
    if (state.status > STATUS.UNLOADED) return;

    setState({ ...state, status: STATUS.LOADING });

    fetch("/api/current")
      .then((r) => r.json())
      .then((data) => {
        setState({ status: STATUS.LOADED, data, error: undefined });
      })
      .catch((error) => {
        console.error("Fetch Error", error);
        setState({ status: STATUS.ERROR, data: undefined, error });
      });
  }, [state.status]);

  const reload = () => setState({ ...state, status: STATUS.UNLOADED });

  return { state, reload };
};
