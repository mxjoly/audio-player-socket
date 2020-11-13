import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdSync, MdSyncDisabled, MdSyncProblem } from 'react-icons/md';
import AudioPlayer from 'react-h5-audio-player';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router';
import './styles.scss';

import { useSocket } from '../../../../client/socket';
import TrackList from '../TrackList';

type Track = {
  id: string | number;
  title: string;
  url: string;
};

interface Music {
  name: string;
  url: string;
}

function AudioControl(props: { musics: Music[]; isAdmin: boolean }) {
  const { roomId } = useParams<{ roomId: string }>();
  const socket = useSocket();
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const [synchronized, setSynchronized] = useState(true);
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0); // In s
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [played, setPlayed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ============================================================ //

  /**
   * Load the musics before the first render
   */
  useEffect(() => {
    loadTracks(props.musics);
    setLoaded(true);
  }, [props.musics]);

  /**
   * Play an audio with the similar start point
   */
  useEffect(() => {
    function handlePlay({ trackId, time }: any) {
      if (currentTrack?.id === trackId) {
        playAudio(time);
      } else {
        const track = trackList.find((track) => track.id === trackId);
        if (track) {
          playNewAudio(track, time);
        } else {
          console.warn('The sync track cannot be loaded');
        }
      }
    }

    if (!props.isAdmin && socket && synchronized) {
      socket.on('play_audio', handlePlay);
    }

    return () => socket.off('play_audio', handlePlay);
  }, [synchronized, trackList, currentTrack, played, socket, props.isAdmin]);

  /**
   * Pause the current audio
   */
  useEffect(() => {
    function handlePause({ time }: any) {
      if (audio && played) {
        pauseAudio(time);
      }
    }

    if (!props.isAdmin && socket && synchronized) {
      socket.on('pause_audio', handlePause);
    }

    return () => socket.off('pause_audio', handlePause);
  }, [synchronized, played, socket, props.isAdmin]);

  /**
   * Change the volume
   */
  useEffect(() => {
    function a(b: any) {
      console.log(b);
      changeVolume(b);
    }

    if (!props.isAdmin && socket && synchronized) {
      socket.on('volume_change', a);
    }

    return () => socket.off('volume_change', a);
  }, [props.isAdmin, synchronized, socket, audio]);

  // ============================================================ //

  /**
   * Set the musics in the track list and set the first track as default
   * @param musics - The list of musics in the room
   */
  function loadTracks(musics: Music[]) {
    const tracks = musics.map((music, i) => ({
      id: i,
      title: music.name,
      url: music.url,
    }));
    setTrackList(tracks);
    setCurrentTrack(tracks[0]);
  }

  /**
   * Play a new track
   * @param track - The track to play
   * @param time - Where to start the audio (in s)
   */
  function playNewAudio(track: Track, time = currentTime) {
    if (audio) {
      if (played) pauseAudio();
      audio.src = track.url;
      audio.title = track.title;
      audio.preload = 'auto';
      setCurrentTrack(track);
      playAudio(time);
    }
  }

  /**
   * Play the current audio with a start point
   * @param time - Where to start the audio (in s)
   */
  function playAudio(time = currentTime) {
    if (audio && currentTrack) {
      audio.play();
      audio.currentTime = time;
      setPlayed(true);
      setCurrentTime(time);
      if (props.isAdmin && socket && synchronized) {
        socket.emit('play_audio', {
          trackId: currentTrack.id,
          time,
          roomId,
        });
      }
    }
  }

  /**
   * Pause the current track played
   * @param time - Where to pause the audio (in s)
   */
  function pauseAudio(time = currentTime) {
    if (audio && currentTrack) {
      audio.pause();
      audio.currentTime = time;
      setPlayed(false);
      setCurrentTime(time);
      if (props.isAdmin && socket && synchronized) {
        socket.emit('pause_audio', {
          trackId: currentTrack.id,
          time,
          roomId,
        });
      }
    }
  }

  /**
   * Change the volume
   * @param newVolume - The new volume
   */
  function changeVolume(newVolume: number) {
    if (audio) {
      audio.volume = newVolume;
      if (props.isAdmin && socket && synchronized) {
        socket.emit('volume_change', { volume: newVolume, roomId });
      }
    }
  }

  /**
   * Skip the current to go to the previous track (-1), or the next track (1)
   * @param a -1 or 1
   */
  function skipTrack(a: number) {
    if (currentTrack) {
      let index = trackList.indexOf(currentTrack);
      if (index > -1) {
        const next = trackList[Math.abs((index + a) % trackList.length)];
        setPlayed(false);
        setCurrentTrack(next);
      }
    }
  }

  /**
   * Listener function when the track is played
   * @param event
   */
  function onListen(event: any) {
    if (!audio) {
      const newAudio = event.target;
      setAudio(newAudio);
    }
    setCurrentTime(event.target.currentTime);
  }

  if (!loaded) {
    return <div />;
  }

  return (
    <div className="AudioControl">
      <div className="AudioControl__Header">
        <h4>{currentTrack?.title}</h4>
        <div className="AudioControl__Sync">
          {!isMobile && (
            <div className="AudioControl__Sync__State">
              {synchronized
                ? 'synchronisation activée'
                : 'synchronisation désactivée'}
            </div>
          )}
          <button
            className="AudioControl__Sync__Button"
            onClick={() => setSynchronized(socket !== null && !synchronized)}
          >
            {socket ? (
              synchronized ? (
                <MdSync size={30} />
              ) : (
                <MdSyncDisabled size={30} />
              )
            ) : (
              <MdSyncProblem size={30} />
            )}
          </button>
        </div>
      </div>
      <div className="AudioControl__Content">
        <AudioPlayer
          className="AudioControl__Player"
          src={currentTrack?.url}
          autoPlayAfterSrcChange={false}
          autoPlay={false}
          showDownloadProgress
          showSkipControls={!isMobile}
          listenInterval={500}
          preload="auto"
          onPlay={() => playAudio()}
          onPause={() => pauseAudio()}
          onEnded={() => setPlayed(false)}
          onListen={onListen}
          onVolumeChange={(event: any) => changeVolume(event.target.volume)}
          onClickNext={() => skipTrack(1)}
          onClickPrevious={() => skipTrack(-1)}
        />
        <TrackList
          tracks={trackList}
          onSelect={setCurrentTrack}
          selected={currentTrack}
        />
      </div>
    </div>
  );
}

AudioControl.propTypes = {
  musics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

AudioControl.defaultPropTypes = {
  musics: [],
};

export default AudioControl;
