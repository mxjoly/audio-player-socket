import React from 'react';
import { MdInfo, MdError, MdCheck } from 'react-icons/md';
import './alert.scss';

const AlertTemplate = ({ message, options, close }: any) => {
  return (
    <div
      className="Alert"
      style={{
        backgroundColor:
          options.type === 'error'
            ? 'red'
            : options.type === 'info'
            ? 'blue'
            : options.type === 'success'
            ? 'green'
            : 'rgba(0,0,0,0.5)',
      }}
    >
      <span className="Alert__Message">{message}</span>
      {options.type === 'info' && <MdInfo size={30} color="white" />}
      {options.type === 'success' && <MdCheck size={30} color="white" />}
      {options.type === 'error' && <MdError size={30} color="white" />}
    </div>
  );
};

export default AlertTemplate;
