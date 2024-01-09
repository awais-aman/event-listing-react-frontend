import { Navigate, useLocation } from "react-router-dom";
import { useEvent } from "../context/EventContext";

export const RequireAuth = ({ children }) => {
  const { state } = useEvent();
  const location = useLocation();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export const GuestOnly = ({ children }) => {
  const { state } = useEvent();
  return state.isAuthenticated ? <Navigate to="/" replace /> : children;
};
