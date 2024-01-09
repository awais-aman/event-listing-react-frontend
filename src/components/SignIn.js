import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { BsFillPersonFill, BsLockFill } from "react-icons/bs";
import axios from "../services/api";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../context/EventContext";
import styled from "styled-components";

const StyledForm = styled(Form)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
`;

const SignIn = () => {
  const navigate = useNavigate();
  const { dispatch } = useEvent();
  const [formData, setFormData] = useState({
    user: {
      email: "",
      password: "",
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

    try {
      const response = await axios.post("/login", formData);
      const token = response.headers["authorization"];

      dispatch({ type: "SIGN_IN", payload: { token } });

      NotificationManager.success(
        "Login successful. Redirecting to Events page.",
        "Success"
      );

      setTimeout(() => {
        navigate("/");
      }, 0);
    } catch (error) {
      NotificationManager.error(
        "Login unsuccessful. \n Please try again.",
        "Error"
      );
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
                  type="text"
                  name="email"
                  value={formData.email}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
            <br />
            <div className="text-center">
              <Button variant="primary" type="submit">
                Sign In
              </Button>
            </div>
          </StyledForm>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
