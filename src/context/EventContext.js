import React, { createContext, useContext, useReducer } from "react";

const EventContext = createContext();

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  myEvents: [],
  joinedEvents: [],
  joinEvents: [],
};

const eventReducer = (state, action) => {
  switch (action.type) {
    case "SIGN_IN":
      localStorage.setItem("token", action.payload.token);
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        myEvents: [],
        joinedEvents: [],
        joinEvents: [],
      };
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
  const [state, dispatch] = useReducer(eventReducer, initialState);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
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

export { EventProvider, useEvent, EventContext };
