import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      // Send signup details to the backend API
      const response = await axios.post('http://localhost:8081/user/signup', {
        name,
        contactNumber,
        email,
        password,
      });

      console.log('Signup successful');
      console.log('Response:', response.data);

      // Reset form fields
      setName('');
      setContactNumber('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const handleClose=async ()=>{
    navigate("/");
  }

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="tel"
            
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
      
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {password !== confirmPassword && (
          <div className="error-message">
            New Password & Confirm Password do not match.
          </div>
        )}
        <div className="button-group">
          <button
            type="submit"
            disabled={
              !name ||
              !contactNumber ||
              !email ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword
            }
          >
            Signup
          </button>
          <button type="button" onClick={handleClose}  >Close</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
