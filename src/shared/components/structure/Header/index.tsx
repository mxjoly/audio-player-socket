import React from 'react';
import { MdMusicNote } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import './styles.scss';

function Header() {
  const history = useHistory();
  return (
    <header className="Header">
      <h1
        onClick={() => {
          history.push('/');
          document.location.reload();
        }}
      >
        <MdMusicNote />
        Music Player
      </h1>
    </header>
  );
}

export default React.memo(Header);
