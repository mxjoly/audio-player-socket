import React from 'react';
import PropTypes from 'prop-types';
import Track from '../../molecules/Track';
import './styles.scss';

type TrackType = {
  id: string | number;
  title: string;
  url: string;
};

type Props = {
  tracks: TrackType[];
  selected: TrackType | null;
  onSelect: (track: TrackType) => void;
};

function TrackList(props: Props) {
  function onSelectTrack(trackID: string | number) {
    const track = props.tracks.find((track) => track.id === trackID);
    if (track) props.onSelect(track);
  }

  return (
    <ul className="TrackList">
      {props.tracks.length > 0 &&
        props.tracks.map((track) => (
          <li key={track.id}>
            <Track
              id={track.id}
              title={track.title}
              selected={track.id === props.selected?.id}
              onSelect={onSelectTrack}
            />
          </li>
        ))}
    </ul>
  );
}

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
};

TrackList.defaultProps = {
  list: [],
};

export default React.memo(TrackList);
