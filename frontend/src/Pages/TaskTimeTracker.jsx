import { useState } from 'react';
import axios from 'axios';

const TaskTimeTracker = ({ task }) => {
  const [hours, setHours] = useState('');
  const [currentTask, setCurrentTask] = useState(task);

  const logTime = async (e) => {
    e.preventDefault();
    if (!hours || isNaN(hours)) return alert('Enter valid hours');

    try {
      const res = await axios.post(`/api/tasks/${currentTask.id}/log-time`, {
        hours,
      });

      // Update task data with new logged hours
      setCurrentTask((prev) => ({
        ...prev,
        logged_hours: parseFloat(res.data.total_logged_hours),
      }));

      setHours('');
    } catch (err) {
      console.error(err);
      alert('Failed to log time');
    }
  };

  const estimated = parseFloat(currentTask.estimate_hours || 0);
  const logged = parseFloat(currentTask.logged_hours || 0);
  const percentage =
    estimated > 0 ? Math.min((logged / estimated) * 100, 100) : 0;

  return (
    <div style={styles.card}>
      <h3>{currentTask.title}</h3>
      <p>
        <strong>Status:</strong> {currentTask.status}
      </p>
      <p>
        <strong>Estimated:</strong> {estimated} hrs
      </p>
      <p>
        <strong>Logged:</strong> {logged.toFixed(2)} hrs
      </p>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressFill(percentage),
            backgroundColor: percentage >= 100 ? '#e74c3c' : '#2ecc71',
          }}
        >
          {Math.round(percentage)}%
        </div>
      </div>

      {/* Time Logging Form */}
      <form onSubmit={logTime} style={styles.form}>
        <input
          type="number"
          step="0.1"
          placeholder="Hours spent"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Log Time
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  progressContainer: {
    height: 25,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    margin: '10px 0',
  },
  progressFill: (percent) => ({
    width: `${percent}%`,
    height: '100%',
    color: '#fff',
    paddingLeft: 10,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
  }),
  form: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '5px 10px',
  },
  button: {
    padding: '5px 15px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
  },
};

export default TaskTimeTracker;
