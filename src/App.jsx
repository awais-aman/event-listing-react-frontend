import { Route, Routes, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import EventDetails from "./components/EventDetails";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Toaster from "./components/Toaster";
import { useEvent } from "./context/EventContext";
import SignOut from "./components/SignOut";
import Footer from "./components/Footer";
import Home from "./layouts/Home";
import { GuestOnly, RequireAuth } from "./components/RequireAuth";
import "./App.css";

const App = () => {
  const { state } = useEvent();
  const { isAuthenticated } = state;

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span style={{ color: "#007bff" }}>Event</span> App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <SignOut />
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="nav-link">
                    Sign In
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup" className="nav-link">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="mt-5 pt-2 bg-light main-content">
        <Routes>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/events/:id" element={<RequireAuth><EventDetails /></RequireAuth>} />
          <Route path="/login" element={<GuestOnly><SignIn /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
        </Routes>
      </div>
      <Toaster />
      <Footer />
    </>
  );
};

export default App;
