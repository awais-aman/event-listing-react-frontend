import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../context/EventContext";
import { logout } from "../services/authService";
import { toast } from "../services/toast";

export default function SignOut() {
  const navigate = useNavigate();
  const { signOut } = useEvent();

  const handleSignOut = async () => {
    await logout();
    signOut();
    toast.success("You have been signed out.", "Signed out", 3000);
    navigate("/login");
  };

  return (
    <Nav.Link as="button" type="button" onClick={handleSignOut}>
      Sign Out
    </Nav.Link>
  );
}
