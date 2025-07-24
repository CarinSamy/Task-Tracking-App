import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: '' };
  }
  callApi() {
    fetch('http://localhost:8081/testAPI')
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }))
      .catch((err) => console.log(err));
  }
  componentDidMount() {
    this.callApi();
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
