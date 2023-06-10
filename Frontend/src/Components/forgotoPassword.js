import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(true);
  };

  const handleSendMail = () => {
    if (email) {
      // Send the email to the API
      const requestData = {
        email: email
      };

      axios
        .post('http://localhost:8081/user/forgotPassword', requestData)
        .then((response) => {
          console.log(response.data); // Handle the response as needed
        })
        .catch((error) => {
          console.error(error); // Handle the error as needed
        });
    } else {
      setIsEmailValid(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <div className="card">
        <div className="card-header">
          <h4>Forgot Password</h4>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${isEmailValid ? '' : 'is-invalid'}`}
              value={email}
              onChange={handleEmailChange}
            />
            {!isEmailValid && <div className="invalid-feedback">Please enter your email.</div>}
          </div>
          <button className="btn btn-primary" style={{marginTop:'10px'}} onClick={handleSendMail}>
            Send Mail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
