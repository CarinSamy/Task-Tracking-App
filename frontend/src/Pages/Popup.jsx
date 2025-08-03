import React from 'react';

const TaskDetailsModal = ({ task, onTimeUpdated }) => {
  if (!task) return null;

  const handleClose = () => {
    onTimeUpdated(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: 'rgba(30, 41, 59, 0.35)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          minWidth: '340px',
          maxWidth: '420px',
          width: '90%',
          padding: '2rem 2.5rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        <h2
          style={{ marginBottom: '1.2rem', color: '#1e3a8a', fontWeight: 700 }}
        >
          {task.title}
        </h2>
        <div style={{ marginBottom: '1rem', color: '#475569' }}>
          <strong>Description:</strong>
          <div
            style={{
              marginTop: '0.25rem',
              marginBottom: '0.75rem',
              color: '#334155',
              fontWeight: 500,
            }}
          >
            {task.description || (
              <span style={{ color: '#64748b' }}>No description</span>
            )}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Status:</strong>{' '}
            <span
              style={{
                color:
                  task.status === 'completed'
                    ? '#16a34a'
                    : task.status === 'in progress'
                      ? '#eab308'
                      : '#2563eb',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {task.status}
            </span>
          </div>
          <div>
            <strong>Estimated Hours:</strong>{' '}
            <span style={{ color: '#0e7490' }}>
              {task.estimatedHours ?? task.estimate_hours ?? 0}
            </span>
          </div>
          <div>
            <strong>Logged Hours:</strong>{' '}
            <span style={{ color: '#0e7490' }}>
              {task.loggedHours ?? task.logged_hours ?? 0}
            </span>
          </div>
          <div>
            <strong>Remaining Time:</strong>{' '}
            <span style={{ color: '#0e7490' }}>
              {Math.max(
                Number(task.estimatedHours ?? task.estimate_hours ?? 0) -
                  Number(task.loggedHours ?? task.logged_hours ?? 0),
                0
              ).toFixed(2)}
            </span>
          </div>
          <div
            style={{
              marginTop: '0.5rem',
              fontSize: '0.95rem',
              color: '#64748b',
            }}
          >
            <div>
              <strong>Created At:</strong>{' '}
              {task.createdAt ?? task.created_at ?? 'N/A'}
            </div>
            <div>
              <strong>Updated At:</strong>{' '}
              {task.updatedAt ?? task.updated_at ?? 'N/A'}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handleClose}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1.2rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30,41,59,0.08)',
              transition: 'background 0.2s',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
