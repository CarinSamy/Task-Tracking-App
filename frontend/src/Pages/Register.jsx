import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    name: '',
    password: '',
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);

    axios
      .post('http://localhost:8081/auth/register', values)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <label>Email</label>
      <input
        type="email"
        className="form-control"
        placeholder="Enter your email"
        required
        onChange={(e) => setValues({ ...values, email: e.target.value })}
      />
      <label className="mt-3">Username</label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter your username"
        required
        onChange={(e) => setValues({ ...values, name: e.target.value })}
      />
      <label>Password</label>
      <input
        type="password"
        className="form-control"
        placeholder="Enter your password"
        required
        onChange={(e) => setValues({ ...values, password: e.target.value })}
      />
      <button type="submit" className="btn btn-secondary mt-3">
        Register
      </button>
      <p className="mt-3">
        Already have an account?{' '}
        <Link to="/" className="btn btn-outline-secondary ml-2">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
