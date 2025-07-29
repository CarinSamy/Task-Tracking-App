import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    axios
      .post('http://localhost:8081/api/auth/login', values)
      .then((res) => {
        setSuccess(res.data.message || 'User logged in successfully!');
        console.log(res.data);
        const token = res.data.token;
        localStorage.setItem('token', token);

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          setError(err.response.data.errors.join(', '));
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Something went wrong.');
        }
      });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      {success && <div className="alert alert-success">{success}</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="form-group custom-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          required
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <label className="mt-3">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your password"
          required
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <button type="submit" className="btn btn-primary mt-4">
          Login
        </button>
      </form>

      <p className="mt-3">
        New user?{' '}
        <Link to="/Register" className="btn btn-outline-secondary ml-2">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
