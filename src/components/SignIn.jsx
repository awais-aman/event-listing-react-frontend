import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsFillPersonFill, BsLockFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEvent } from "../context/EventContext";
import { login } from "../services/authService";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";

const StyledForm = styled(Form)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
`;

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
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <StyledForm onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Sign In</h2>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon">
                    <BsFillPersonFill size={30} />
                  </span>
                </div>
                <Form.Control
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon">
                    <BsLockFill size={30} />
                  </span>
                </div>
                <Form.Control
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
            <br />
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </StyledForm>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
