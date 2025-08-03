import React, { useState, useCallback, useEffect } from 'react';
import api from '../axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import TaskDetailsModal from './Popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTasks } from '../reactContext';

const Dashboard = () => {
  const { tasks, setTasks } = useTasks();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setStatus] = useState('to-do');
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('to-do');
  const [estimated, setEstimated] = useState(0);
  const [logged, setLogged] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [newEstimatedTime, setNewEstimatedTime] = useState('');

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
  }, [handleAuthError, navigate, setTasks]);

  const createTask = () => {
    api
      .post('/tasks', {
        title: newTitle,
        description: newDescription,
        estimate_hours: parseFloat(newEstimatedTime) || 0,
        status: newStatus,
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTitle('');
        setNewDescription('');
        setNewEstimatedTime('');
        setStatus('to-do');
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
    setEstimated(parseFloat(task.estimate_hours) || 0);
    setLogged(task.logged_hours || 0);
  };

  const cancelEditing = () => {
    setEditTask(null);
    setEditTitle('');
    setEditDescription('');
    setEditStatus('to-do');
    setEstimated('');
    setLogged(0);
  };

  const updateTask = () => {
    api
      .patch(`/tasks/${editTask.id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
        estimate_hours: estimated,
        logged_hours: logged,
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
    <>
      <nav className="navbar">
        <h1 className="navbar-content">Dashboard</h1>
        <Link onClick={handleLogout} className="logout">
          Logout
        </Link>
      </nav>
      <div className="Task-Tracking-App">
        {userData && (
          <p className="mb-2 text-gray-700 text-center">
            Welcome, {userData.name}!
          </p>
        )}
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Add Task</h2>

        <div className="Tasks flex flex-col space-y-2 mb-4">
          <input
            className="inputs p-2 rounded border border-gray-300"
            placeholder="Title"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="inputs p-2 rounded border border-gray-300"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <input
            className="inputs p-2 rounded border border-gray-300"
            type="number"
            placeholder="Estimated Time (e.g. 3h)"
            required
            value={newEstimatedTime}
            onChange={(e) => setNewEstimatedTime(e.target.value)}
          />
          <select
            className="p-2 rounded border border-gray-300 mb-2 w-full"
            value={newStatus}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="to-do">To-Do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            className="add-task bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={createTask}
          >
            Add Task
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Tasks</h2>
        <ol>
          {tasks.map((task) => (
            <li key={task.id} className=" mt-3">
              {editTask?.id === task.id ? (
                <>
                  <input
                    className="p-2 rounded border border-gray-300 mb-2 w-full"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    className="p-2 rounded border border-gray-300 mb-2 w-full"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <input
                    type="number"
                    value={estimated}
                    onChange={(e) => setEstimated(parseFloat(e.target.value))}
                  />
                  <input
                    type="number"
                    value={logged}
                    onChange={(e) => setLogged(parseFloat(e.target.value))}
                  />
                  <select
                    className="p-2 rounded border border-gray-300 mb-2 w-full"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="to-do">To-Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 px-3 py-1 rounded text-white"
                      onClick={updateTask}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 px-3 py-1 rounded text-white"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <strong
                    className="title cursor-pointer text-blue-700"
                    onClick={() => setSelectedTask(task)}
                  >
                    {task.title}
                  </strong>
                  <em
                    className={
                      task.status === 'completed'
                        ? 'status-completed'
                        : task.status === 'in progress'
                          ? 'status-inprogress'
                          : 'status-todo'
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {task.status}
                  </em>
                  <div
                    className="progress-bar-container"
                    style={{ margin: '8px 0' }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        height: '18px',
                        background: '#ebe6e5ff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            ((task.logged_hours || 0) /
                              (task.estimate_hours || 1)) *
                              100
                          )}%`,
                          background:
                            (task.logged_hours || 0) /
                              (task.estimate_hours || 1) >
                            1
                              ? '#e34242ff'
                              : '#22c55e',
                          height: '100%',
                          borderRadius: '8px 0 0 8px',
                          transition: 'width 0.4s',
                        }}
                      ></div>
                      <span
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textShadow: '0 1px 2px hsla(0, 83%, 39%, 0.15)',
                        }}
                      >
                        {task.logged_hours || 0} / {task.estimate_hours || 0}{' '}
                        hrs
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-1"></div>
                  <div className="icons flex gap-2 mt-2">
                    <button
                      className="Edit-task bg-yellow-500 p-2 rounded text-white flex items-center justify-center"
                      onClick={() => startEditing(task)}
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      className="Delete-task bg-red-600 p-2 rounded text-white flex items-center justify-center"
                      onClick={() => deleteTask(task.id)}
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>

        <TaskDetailsModal
          task={selectedTask}
          onTimeUpdated={(updatedTask) => {
            setSelectedTask(updatedTask);
          }}
        />
      </div>
    </>
  );
};
export default Dashboard;
