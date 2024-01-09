import React, { useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import EventDetails from "./components/EventDetails";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { NotificationContainer } from "react-notifications";
import { useEvent } from "./context/EventContext";
import SignOut from "./components/SignOut";
import Footer from "./components/Footer";
import Home from "./layouts/Home";
import "./App.css";

const App = () => {
  const { state, dispatch } = useEvent();
  const { isAuthenticated } = state;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && isAuthenticated !== undefined && window.location.pathname !== "/signup") {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
                <>
                  <SignOut dispatch={dispatch} />
                </>
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
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
      <NotificationContainer />
      <Footer />
    </>
  );
};

export default App;
