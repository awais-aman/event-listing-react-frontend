import { Route, Routes, Link, NavLink } from "react-router-dom";
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
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar expand="md" sticky="top" className="site-nav" variant="dark" aria-label="Main">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="brand__mark" aria-hidden="true">EL</span>
            Event Listing
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="site-nav-links" />
          <Navbar.Collapse id="site-nav-links">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <SignOut />
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    Sign In
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/signup">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main id="main" className="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/events/:id" element={<RequireAuth><EventDetails /></RequireAuth>} />
          <Route path="/login" element={<GuestOnly><SignIn /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
        </Routes>
      </main>
      <Toaster />
      <Footer />
    </>
  );
};

export default App;
