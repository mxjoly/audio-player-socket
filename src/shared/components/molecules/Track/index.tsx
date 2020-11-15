import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { MdQueueMusic } from 'react-icons/md';
import './styles.scss';

type Props = {
  id: React.Key;
  title: string;
  selected: boolean;
  onSelect: (trackID: string | number) => void;
};

function Track(props: Props) {
  return (
    <div
      className={['Track', props.selected && 'Track_selected']
        .filter(Boolean)
        .join(' ')}
      onClick={() => props.onSelect(props.id)}
    >
      <IconContext.Provider value={{ className: 'Track__Icon' }}>
        <MdQueueMusic size={30} />
      </IconContext.Provider>
      <div className="Track__Title">{props.title}</div>
    </div>
  );
}

Track.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default React.memo(Track);
