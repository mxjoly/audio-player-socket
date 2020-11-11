import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const Backdrop = ({ onClick, show }: any) => {
  return show && <div className="EventHandler" onClick={onClick}></div>;
};

Backdrop.propTypes = {
  onClick: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default React.memo(Backdrop);
