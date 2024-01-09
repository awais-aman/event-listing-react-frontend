import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsFillPersonFill, BsLockFill, BsEnvelopeFill } from "react-icons/bs";
import axios from "../services/api";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledForm = styled(Form)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
`;
const SignUp = () => {
  const navigate = useNavigate();
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
      NotificationManager.error(
        "Password and Confirm Password do not match.",
        "Error"
      );
      return;
    }

    try {
      await axios.post("/signup", formData);
      NotificationManager.success(
        "Sign up successful. Redirecting to login page.",
        "Success"
      );
      navigate("/login");
    } catch (error) {
      const errorMessages = error.response.data?.status || [];
      const errorMessageList = (
        <ul>
          {errorMessages.map((errorMessage, index) => (
            <li key={index}>{errorMessage}</li>
          ))}
        </ul>
      );
      NotificationManager.error(
        <>
          <p>Please try again.</p>
          {errorMessageList}
        </>,
        "Error"
      );
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
                  value={formData.user.passwordConfirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
            <br />
            <div className="text-center">
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </div>
          </StyledForm>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
