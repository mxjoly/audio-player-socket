import React from 'react';
import { MdMusicNote } from 'react-icons/md';
import './styles.scss';

function Header() {
  return (
    <header className="Header">
      <h1>
        <MdMusicNote />
        Formation Musicale
      </h1>
    </header>
  );
}

export default Header;
