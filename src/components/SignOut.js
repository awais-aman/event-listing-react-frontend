import React from "react";
import { logout } from "../services/authService";
import { NotificationManager } from "react-notifications";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function SignOut({ dispatch }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const token = localStorage.getItem("token");
    const success = await logout(token);

    if (success) {
      dispatch({ type: "SIGN_OUT" });
      NotificationManager.success("Signout successful.", "Success", 3000);
      navigate("/login");
    }
  };

  return (
    <div>
      <Nav.Link as={Link} to={"/"} onClick={handleSignOut}>
        Sign Out
      </Nav.Link>
    </div>
  );
}
