import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'socket.io';
import { IconContext } from 'react-icons';
import { MdSync, MdSyncDisabled, MdSyncProblem } from 'react-icons/md';
import './styles.scss';

import ProgressBar from '../../atoms/ProgressBar';
import TrackList from '../../organisms/TrackList';

type Track = {
  id: string | number;
  title: string;
  duration: number;
  url: string;
};

const TRACK_LOCATION = '/assets/musics/';

const IS_ADMIN = window.location.search.includes('?admin=true');

function MediaPlayer(props: { sources: string[]; socket: Socket }) {
  const [synchronized, setSynchronized] = useState(false);
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0); // In s
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [played, setPlayed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTracks(props.sources);
    setLoaded(true);
  }, []);

  if (!IS_ADMIN) {
    useEffect(() => {
      function handlePlay({ id, time }: any) {
        const track = trackList.find((track) => track.id === id);
        if (track) {
          onSelectTrack(track, time);
        } else {
          console.warn('The sync track cannot be loaded');
        }
      }

      if (!synchronized) return;

      props.socket.on('play', handlePlay);

      return () => {
        props.socket.off('play', handlePlay);
      };
    }, [
      synchronized,
      loaded,
      trackList,
      audio,
      currentTrack,
      played,
      props.socket,
    ]);

    useEffect(() => {
      function handlePause() {
        if (audio && played) {
          stopAudio();
          setPlayed(false);
        }
      }

      if (!synchronized) return;

      props.socket.on('pause', handlePause);

      return () => {
        props.socket.off('pause', handlePause);
      };
    }, [synchronized, audio, played, props.socket]);

    useEffect(() => {
      function handleChange({ id, time, played: adminPlayed }: any) {
        if (audio) {
          audio.currentTime = time;
          setCurrentTime(time);
          if (played !== adminPlayed) {
            if (played) {
              stopAudio();
            }
            setPlayed(adminPlayed);
          }
        }
      }

      if (!synchronized) return;

      props.socket.on('change', handleChange);

      return () => {
        props.socket.off('change', handleChange);
      };
    }, [synchronized, audio, played, props.socket]);
  }

  function loadTracks(names: string[]) {
    const urls = names.map((name) => TRACK_LOCATION + name);
    const audios = urls.map((url) => new Audio(url));

    let tracks: any = [];
    let promises: Promise<any>[] = [];

    audios.forEach((audio, i) => {
      promises.push(
        new Promise((resolve) => {
          audio.onloadedmetadata = function () {
            const index = names[i].lastIndexOf('.');
            const title = audio.title || names[i].slice(0, index);
            const duration = Math.floor(audio.duration);
            tracks.push({
              id: i,
              title,
              duration,
              url: audio.src,
            });
            resolve();
          };
        })
      );
    });

    Promise.all(promises).then(() => {
      setTrackList(tracks);
    });
  }

  function createAudio(src: string, currentTime = 0) {
    const audio = new Audio(src);
    audio.currentTime = currentTime;
    audio.preload = 'auto';
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.onended = () => {
      setPlayed(false);
      setAudio(createAudio(src));
      setCurrentTime(0);
    };
    return audio;
  }

  function startNewAudio(track: Track, time = 0) {
    if (played) stopAudio();
    const newAudio = createAudio(track.url, time);
    newAudio.load();
    newAudio.play();
    setPlayed(true);
    setAudio(newAudio);
    setCurrentTrack(track);
    if (IS_ADMIN) {
      props.socket.emit('play', { id: track.id, time });
    }
  }

  function stopAudio() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  function onSelectTrack(track: Track, time = 0) {
    if (currentTrack && audio && currentTrack.id === track.id) {
      if (played) {
        audio.pause();
        setPlayed(false);
        if (IS_ADMIN) {
          props.socket.emit('pause', {
            id: currentTrack.id,
            time: audio.currentTime,
          });
        }
      } else {
        if (audio.currentTime !== time) {
          audio.currentTime = time;
          setCurrentTime(time);
        }
        audio.play();
        setPlayed(true);
        if (IS_ADMIN) {
          props.socket.emit('play', {
            id: currentTrack.id,
            time: audio.currentTime,
          });
        }
      }
    } else if (currentTrack && audio && currentTrack.id !== track.id) {
      const newTrack = trackList.find((t) => t.id === track.id);
      if (newTrack) {
        if (played) {
          stopAudio();
          setPlayed(false);
        }
        startNewAudio(newTrack, time);
      } else {
        console.warn('The sync track cannot be loaded');
      }
    } else if (!currentTrack && !audio) {
      const newTrack = trackList.find((t) => t.id === track.id);
      if (newTrack) {
        startNewAudio(newTrack, time);
      } else {
        console.warn('The sync track cannot be loaded');
      }
    }
  }

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

  function onTimeChange(time: number) {
    if (audio && currentTrack && isFinite(time)) {
      audio.currentTime = time;
      setCurrentTime(time);
      if (IS_ADMIN) {
        props.socket.emit('change', {
          id: currentTrack.id,
          time: audio.currentTime,
          played: played,
        });
      }
    }
  }

  if (!loaded) {
    return <div />;
  }

  return (
    <div className="MediaPlayer">
      <div className="MediaPlayer__Header">
        <h2>Music Player</h2>
        <div className="MediaPlayer__Sync">
          <div className="MediaPlayer__Sync__State">
            {synchronized
              ? 'synchronisation activée'
              : 'synchronisation désactivée'}
          </div>
          <button
            className="MediaPlayer__Sync__Button"
            onClick={() => setSynchronized(!synchronized)}
          >
            {synchronized ? <MdSync size={30} /> : <MdSyncDisabled size={30} />}
          </button>
        </div>
      </div>
      <div className="MediaPlayer__Content">
        <div className="MediaPlayer__Track">
          <div className="MediaPlayer__Track__Timer">
            {formatTime(currentTime)}
          </div>
          <div className="MediaPlayer__Track__Title">
            {currentTrack?.title || ''}
          </div>
          <div className="MediaPlayer__Track__Duration">
            {currentTrack ? formatTime(currentTrack.duration) : '--'}
          </div>
        </div>
        <ProgressBar
          value={currentTime}
          maxValue={audio ? audio.duration : 100}
          onValueChange={onTimeChange}
        />
        <TrackList
          tracks={trackList}
          onSelect={onSelectTrack}
          played={played}
          selected={currentTrack}
        />
      </div>
    </div>
  );
}

MediaPlayer.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  socket: PropTypes.any.isRequired,
};

export default MediaPlayer;
