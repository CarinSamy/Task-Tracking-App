import React, { useState, useCallback, useEffect } from 'react';
import api from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
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
  const [error, setError] = useState('');

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

  const createTask = (e) => {
    e.preventDefault();
    if (
      !newTitle.trim() ||
      !parseFloat(newEstimatedTime) ||
      !newDescription.trim()
    ) {
      setError('Title, Description estimate time are required.');
      return;
    }

    if (
      parseFloat(newEstimatedTime) < 0 ||
      isNaN(parseFloat(newEstimatedTime))
    ) {
      setError('Estimated time must be a non-negative number.');
      return;
    }

    setError('');

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

  const updateTask = (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !estimated || !editDescription.trim()) {
      setError('Title, Description estimate time are required.');
      return;
    }

    if (logged < 0) {
      setError('Logged time cannot be negative.');
      return;
    }

    setError('');

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
        <button
          onClick={handleLogout}
          className=" logout bg-transparent text-sm text-blue-700 hover:underline"
        >
          Logout
        </button>
      </nav>
      <div className="Task-Tracking-App">
        {userData && (
          <p className="mb-2 text-gray-700 text-center">
            Welcome, {userData.name}!
          </p>
        )}
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Add Task</h2>
        <form onSubmit={createTask}>
          <div className="Tasks flex flex-col space-y-2 mb-4">
            <input
              className="inputs p-2 rounded border border-gray-300"
              placeholder="Title"
              required
              value={newTitle}
              maxLength={10}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              className="inputs p-2 rounded border border-gray-300"
              placeholder="Description"
              required
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
              className="inputs p-2 rounded border border-gray-300 mb-2 w-full"
              value={newStatus}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="to-do">To-Do</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              type="submit"
              className="inputs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Add Task
            </button>
            {error && (
              <div className="err text-red-600 text-sm font-medium mb-2 text-center">
                {error}
              </div>
            )}
          </div>
        </form>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Tasks</h2>
        <ol>
          {tasks.map((task) => (
            <li key={task.id} className="mt-3">
              {editTask?.id === task.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="edit-label block text-sm text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      className="edit-input p-2 rounded border border-gray-300 w-full"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter task title"
                    />
                  </div>
                  <form onSubmit={updateTask}>
                    <div>
                      <label className="edit-label block text-sm text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        className="edit-input p-2 rounded border border-gray-300 w-full"
                        required
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Enter task description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="edit-label block text-sm text-gray-700 mb-1">
                          Estimated Hours
                        </label>
                        <input
                          type="number"
                          className="edit-input p-2 rounded border border-gray-300 w-full"
                          required
                          value={estimated}
                          onChange={(e) =>
                            setEstimated(parseFloat(e.target.value))
                          }
                          placeholder="e.g., 5"
                        />
                      </div>
                      <div>
                        <label className="edit-label block text-sm text-gray-700 mb-1">
                          Logged Hours
                        </label>
                        <input
                          type="number"
                          className="edit-input p-2 rounded border border-gray-300 w-full"
                          required
                          value={logged}
                          onChange={(e) =>
                            setLogged(parseFloat(e.target.value))
                          }
                          placeholder="e.g., 3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="edit-label block text-sm text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="edit-input p-2 rounded border border-gray-300 w-full"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="to-do">To-Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="err flex gap-2 pt-2">
                      {error && (
                        <div className="text-red-600 text-sm font-medium mb-2 text-center">
                          {error}
                        </div>
                      )}

                      <button
                        className="edit-buttons bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                        onSubmit={updateTask}
                      >
                        Save
                      </button>
                      <button
                        className="edit-buttons bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white"
                        onSubmit={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
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
                        : task.status === 'in-progress'
                          ? 'status-inprogress'
                          : 'status-todo'
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {task.status}
                  </em>
                  <div className="progress-bar-container my-2">
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
