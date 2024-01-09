import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import { describeApiError } from "../services/errors";
import { toast } from "../services/toast";

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
      toast.error("Password and Confirm Password do not match.", "Sign up failed");
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
    <Container className="auth-page">
      <Form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="mb-4">Sign Up</h1>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            autoComplete="name"
            value={formData.user.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            autoComplete="email"
            value={formData.user.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.user.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPasswordConfirmation">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="passwordConfirmation"
            autoComplete="new-password"
            value={formData.user.passwordConfirmation}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <div className="d-grid mt-4">
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up"}
          </Button>
        </div>
        <p className="mt-3 mb-0">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </Form>
    </Container>
  );
};

export default SignUp;
