import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { onUnauthorized } from "../services/api";
import { clearToken, getToken, saveToken } from "../services/session";
import { toast } from "../services/toast";

const EventContext = createContext();

const emptyCollections = {
  myEvents: [],
  joinedEvents: [],
  joinEvents: [],
};

const createInitialState = () => ({
  isAuthenticated: Boolean(getToken()),
  ...emptyCollections,
});

const eventReducer = (state, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT":
      return { ...state, isAuthenticated: false, ...emptyCollections };
    case "MY_EVENTS":
      return { ...state, myEvents: action.payload };
    case "JOINED_EVENTS":
      return { ...state, joinedEvents: action.payload };
    case "JOIN_EVENTS":
      return { ...state, joinEvents: action.payload };
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
