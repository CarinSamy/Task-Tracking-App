import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    name: '',
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
      .post('http://localhost:8081/api/auth/register', values)
      .then((res) => {
        setSuccess('User registered successfully!');
        console.log(res.data);
        setTimeout(() => {
          navigate('/');
        }, 2000);
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
    <form onSubmit={handleSubmit} className="container mt-5">
      <h2>Register</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}

      <label className="mt-3">Email</label>
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

      <label className="mt-3">Password</label>
      <input
        type="password"
        className="form-control"
        placeholder="Enter your password"
        required
        onChange={(e) => setValues({ ...values, password: e.target.value })}
      />

      <button type="submit" className="btn btn-secondary mt-4">
        Register
      </button>

      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/" className="btn btn-outline-secondary ml-2">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
