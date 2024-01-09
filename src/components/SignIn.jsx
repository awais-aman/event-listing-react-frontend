import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEvent } from "../context/EventContext";
import { login } from "../services/authService";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";

const loginErrorMessage = (error) => {
  if (error.response?.status === 401) return "Email or password is incorrect.";
  if (error.response || error.request) return describeApiError(error);
  return error.message;
};

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useEvent();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = await login(credentials);
      signIn(token);
      toast.success("Welcome back.", "Signed in");
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (error) {
      toast.error(loginErrorMessage(error), "Sign in failed");
      setSubmitting(false);
    }
  };

  return (
    <Container className="auth-page">
      <Form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="mb-4">Sign In</h1>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            autoComplete="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <div className="d-grid mt-4">
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </div>
        <p className="mt-3 mb-0">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </Form>
    </Container>
  );
};

export default SignIn;
