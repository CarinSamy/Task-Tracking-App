import React, { useState, useCallback, useEffect } from 'react';
import api from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('to-do');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error(err);
        }
      });
  }, [navigate]);

  const handleAuthError = useCallback(
    (err) => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error(err);
      }
    },
    [navigate]
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    api
      .get('/tasks')
      .then((res) => setTasks(res.data))
      .catch(handleAuthError);
  }, [handleAuthError, navigate]);

  const createTask = () => {
    api
      .post('/tasks', {
        title: newTitle,
        description: newDescription,
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTitle('');
        setNewDescription('');
      })
      .catch(handleAuthError);
  };

  const deleteTask = (id) => {
    api
      .delete(`/tasks/${id}`)
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
    api
      .put(`/tasks/${editTask.id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      })
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
