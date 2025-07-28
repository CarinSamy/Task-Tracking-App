import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('to-do');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8081/api/dashboard', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data.user);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      navigate('/login');
    } else {
      console.error(err);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true }, (window.location.href = '/login'));
  };

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/tasks', authHeader)
      .then((res) => setTasks(res.data))
      .catch(handleAuthError);
  }, []);

  const createTask = () => {
    axios
      .post(
        'http://localhost:8081/api/tasks',
        { title: newTitle, description: newDescription },
        authHeader
      )
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTitle('');
        setNewDescription('');
      })
      .catch(handleAuthError);
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:8081/api/tasks/${id}`, authHeader)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch(handleAuthError);
  };

  const startEditing = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
  };

  const cancelEditing = () => {
    setEditTask(null);
    setEditTitle('');
    setEditDescription('');
    setEditStatus('to-do');
  };

  const updateTask = () => {
    axios
      .put(
        `http://localhost:8081/api/tasks/${editTask.id}`,
        {
          title: editTitle,
          description: editDescription,
          status: editStatus,
        },
        authHeader
      )
      .then((res) => {
        setTasks(
          tasks.map((t) => (t.id === editTask.id ? { ...t, ...res.data } : t))
        );
        cancelEditing();
      })
      .catch(handleAuthError);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      {userData && <p>Welcome, {userData.name}!</p>}
      <h2>My Tasks</h2>
      <input
        placeholder="Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <button onClick={createTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginTop: '10px' }}>
            {editTask?.id === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="to-do">To-Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={updateTask}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{task.title}</strong> — {task.description}
                <em> [{task.status}]</em>
                <br />
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
