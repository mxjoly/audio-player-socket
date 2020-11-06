import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { MdPlayArrow, MdPause } from 'react-icons/md';
import './styles.scss';

type Props = {
  id: React.Key;
  title: string;
  duration: number;
  played: boolean;
  selected: boolean;
  onSelect: (trackID: string | number) => void;
};

function formatTime(time: number) {
  let hours: any = Math.floor(time / 3600);
  let mins: any = Math.floor((time % 3600) / 60);
  let secs: any = Math.floor(time % 60);

  if (secs < 10) secs = '0' + secs;
  if (hours) {
    if (mins < 10) mins = '0' + mins;
    return hours + ':' + mins + ':' + secs; // hh:mm:ss
  } else {
    return mins + ':' + secs; // mm:ss
  }
}

function Track(props: Props) {
  return (
    <div
      className={['Track', props.selected && 'Track_selected']
        .filter(Boolean)
        .join(' ')}
      onClick={() => props.onSelect(props.id)}
    >
      <div className="Track__Panel">
        <IconContext.Provider value={{ className: 'Track__Button' }}>
          {props.played ? <MdPause /> : <MdPlayArrow />}
        </IconContext.Provider>
        <div className="Track__Title">{props.title}</div>
      </div>
      <div className="Track__Duration">{formatTime(props.duration)}</div>
    </div>
  );
}

Track.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  played: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default Track;
