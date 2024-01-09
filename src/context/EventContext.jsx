import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { onUnauthorized } from "../services/api";
import { clearToken, getToken, saveToken } from "../services/session";
import { toast } from "../services/toast";

const EventContext = createContext();

const emptyCollection = { items: [], total: 0 };

const emptyCollections = {
  mine: emptyCollection,
  joined: emptyCollection,
  joinable: emptyCollection,
};

const createInitialState = () => ({
  isAuthenticated: Boolean(getToken()),
  ...emptyCollections,
});

const withoutId = (items, id) => items.filter((item) => item.id !== id);

const eventReducer = (state, action) => {
  const collection = state[action.key];

  switch (action.type) {
    case "SIGN_IN":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT":
      return { ...state, isAuthenticated: false, ...emptyCollections };
    case "LOADED": {
      const loaded = action.append
        ? [...collection.items, ...action.items.filter((e) => !collection.items.some((c) => c.id === e.id))]
        : action.items;
      return { ...state, [action.key]: { items: loaded, total: action.total } };
    }
    case "ADDED":
      return {
        ...state,
        [action.key]: {
          items: [action.event, ...withoutId(collection.items, action.event.id)],
          total: collection.total + 1,
        },
      };
    case "UPDATED":
      return {
        ...state,
        [action.key]: {
          ...collection,
          items: collection.items.map((e) => (e.id === action.event.id ? action.event : e)),
        },
      };
    case "REMOVED":
      return {
        ...state,
        [action.key]: {
          items: withoutId(collection.items, action.id),
          total: Math.max(collection.total - 1, 0),
        },
      };
    default:
      return state;
  }
};

const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, undefined, createInitialState);

  const signIn = useCallback((token) => {
    saveToken(token);
    dispatch({ type: "SIGN_IN" });
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    dispatch({ type: "SIGN_OUT" });
  }, []);

  useEffect(
    () =>
      onUnauthorized(() => {
        // Several requests can fail together; only the first one signs out.
        if (!getToken()) return;
        signOut();
        toast.error("Your session has expired. Please sign in again.", "Signed out");
      }),
    [signOut]
  );

  return (
    <EventContext.Provider value={{ state, dispatch, signIn, signOut }}>
      {children}
    </EventContext.Provider>
  );
};

const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

export { EventProvider, useEvent, EventContext, eventReducer };
