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

// Signing in flips isAuthenticated before SignIn's own navigate() lands, so
// this redirect has to honour the page that asked for the sign-in as well.
export const GuestOnly = ({ children }) => {
  const { state } = useEvent();
  const location = useLocation();

  if (state.isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;
  }
  return children;
};
