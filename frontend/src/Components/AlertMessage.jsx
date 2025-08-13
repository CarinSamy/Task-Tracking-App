import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

const alertStyles = {
  success: 'bg-green-100 border border-green-400 text-green-700',
  error: 'bg-red-100 border border-red-400 text-red-700',
};

const AlertMessage = ({ type, message }) => {
  if (!message) return null;

  const icon = type === 'success' ? faCircleCheck : faCircleXmark;

  return (
    <div
      className={`flex items-center p-3 mb-4 rounded ${alertStyles[type]}`}
      role="alert"
      data-testid={`alert-${type}`}
    >
      <FontAwesomeIcon
        icon={icon}
        className="mr-2"
        style={{ color: type === 'success' ? 'green' : 'red' }}
      />
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
