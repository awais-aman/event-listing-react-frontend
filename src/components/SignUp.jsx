import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsFillPersonFill, BsLockFill, BsEnvelopeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";
import styled from "styled-components";

const StyledForm = styled(Form)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
`;
const SignUp = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      user: { ...formData.user, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.user.password !== formData.user.passwordConfirmation) {
      toast.error(
        "Password and Confirm Password do not match.",
        "Error"
      );
      return;
    }

    setSubmitting(true);
    try {
      await signup(formData.user);
      toast.success("Your account is ready. Please sign in.", "Signed up");
      navigate("/login");
    } catch (error) {
      toast.error(describeApiError(error), "Sign up failed");
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <StyledForm onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Sign Up</h2>

            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon">
                    <BsFillPersonFill size={30} />
                  </span>
                </div>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.user.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon">
                    <BsEnvelopeFill size={30} />
                  </span>
                </div>
                <Form.Control
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.user.email}
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
                  autoComplete="new-password"
                  value={formData.user.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formPasswordConfirmation">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon">
                    <BsLockFill size={30} />
                  </span>
                </div>
                <Form.Control
                  type="password"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  value={formData.user.passwordConfirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
            <br />
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
          </StyledForm>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
