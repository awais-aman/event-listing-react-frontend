import { useCallback, useEffect, useState } from "react";
import { useEvent } from "../context/EventContext";
import api from "../services/api";
import { describeApiError } from "../services/errors";

export const PAGE_SIZE = 12;

const PATHS = {
  mine: "/api/v1/events",
  joined: "/api/v1/events/joined_events",
  joinable: "/api/v1/events/get_events",
};

// Loads one of the three event lists page by page. The API caps every list
// (50 rows by default) and reports the full size in X-Total-Count.
export const useEventCollection = (key) => {
  const { state, dispatch } = useEvent();
  const { items, total } = state[key];
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get(PATHS[key], { params: { page, per_page: PAGE_SIZE } })
      .then((response) => {
        if (!active) return;
        const rows = Array.isArray(response.data) ? response.data : [];
        const reported = Number(response.headers["x-total-count"]);
        dispatch({
          type: "LOADED",
          key,
          items: rows,
          append: page > 1,
          total: Number.isFinite(reported) && reported > 0 ? reported : rows.length,
        });
        setStatus("ready");
      })
      .catch((err) => {
        if (!active || err.sessionExpired) return;
        setError(describeApiError(err, "The events could not be loaded."));
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [key, page, attempt, dispatch]);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }, []);

  const loadMore = useCallback(() => {
    setStatus("loading");
    setPage((current) => current + 1);
  }, []);

  return {
    events: items,
    total,
    status,
    error,
    retry,
    loadMore,
    hasMore: items.length < total,
  };
};
