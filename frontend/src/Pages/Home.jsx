import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add login logic here
    //console.log("Login submitted");
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form className="form-group custom-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          required
        />
        <label className="mt-3">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your password"
          required
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

export default Home;
