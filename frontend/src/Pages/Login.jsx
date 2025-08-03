import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <div className="Login form-group custom-form">
      <h1 className="text-2xl text-center font-bold mb-4 text-gray-800">
        Login
      </h1>

      {success && (
        <div className="alert alert-sucess">
          <FontAwesomeIcon
            icon={faCircleCheck}
            style={{ color: 'green', marginRight: '8px' }}
          />
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon
            icon={faCircleXmark}
            style={{ color: 'red', marginRight: '8px' }}
          />
          {error}
        </div>
      )}

      <form className="" onSubmit={handleSubmit}>
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
