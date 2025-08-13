// src/hooks/useTasks.js
import { useState, useEffect } from 'react';
import axios from '../axiosInstance';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (taskData) => {
    try {
      const res = await axios.post('/tasks', taskData);
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return {
    tasks,
    loading,
    addTask,
    deleteTask,
  };
};
