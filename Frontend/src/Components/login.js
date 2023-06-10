import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const requestData = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        "http://localhost:8081/user/login",
        requestData
      );

      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("role", role);

        // Redirect to a protected route or perform any other necessary actions
        setResponseMessage("Login successfull!!");
        navigate("/dashboard");
      } else {
        setError("Enter correct credentials");
      }
    } catch (error) {
      setError("Email or Password is incorrct");
    }
  };

  return (
    <Container style={{ maxWidth: "400px" }}>
      <div className="login-container">
        <h2>Login</h2>
        <Form
          className="login-form"
          style={{ border: "1px solid #ccc", padding: "20px" }}
        >
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={handleLogin}
            style={{ margin: "20px auto", display: "block" }}
          >
            Login
          </Button>
          {error && <div className="error-message">{error}</div>}
          {responseMessage && (
            <div className="response-message">{responseMessage}</div>
          )}
        </Form>
      </div>
    </Container>
  );
};

export default Login;
