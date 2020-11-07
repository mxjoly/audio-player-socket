import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

function Content(props: any) {
  return <div className="Content">{props.children}</div>;
}

Content.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Content;
