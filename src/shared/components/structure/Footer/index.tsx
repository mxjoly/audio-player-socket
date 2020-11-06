import React from 'react';
import './styles.scss';

function Footer() {
  return (
    <footer className="Footer">
      <p className="Footer__Text">
        Dévelopé par{' '}
        <a
          className="Footer__Author"
          href="https://github.com/mxjoly"
          target="_blank"
        >
          Maxime Joly
        </a>
      </p>
    </footer>
  );
}

Footer.propTypes = {};

export default Footer;
