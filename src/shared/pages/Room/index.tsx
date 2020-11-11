import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useLocation } from 'react-router-dom';
import { useAlert } from 'react-alert';
import CopyToClipboard from 'react-copy-to-clipboard';
import EventHandler from '../../components/atoms/EventHandler';
import axios from 'axios';
import './styles.scss';

import AudioControl from '../../components/organisms/AudioControl';
import { useSocket } from '../../../client/socket';

interface Music {
  name: string;
  url: string;
}

function Room() {
  const socket = useSocket();
  const location = useLocation<{ fromHome: boolean }>();
  const query = new URLSearchParams(location.search);
  const alert = useAlert();

  const { roomId } = useParams<{ roomId: string }>();
  const [name, setName] = useState('');
  const [size, setSize] = useState(0);
  const [admin, setAdmin] = useState('');
  const [musics, setMusics] = useState<Music[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [activeUsers, setActiveUsers] = useState<{ name: string }[]>([]);
  const [currentAlert, setCurrentAlert] = useState<any>(null);

  useEffect(() => {
    socket.on('join_room', setActiveUsers);
    return () => socket.off('join_room', setActiveUsers);
  }, []);

  useEffect(() => {
    socket.on('leave_room', setActiveUsers);
    return () => socket.off('leave_room', setActiveUsers);
  }, []);

  useEffect(() => {
    // The user is admin if the query contains admin variable to true
    const isCurrentlyAdmin = query.get('admin');
    if (isCurrentlyAdmin?.match(/(true|false)/)) {
      setIsAdmin(isCurrentlyAdmin === 'true' ? true : false);
    }
  }, [query]);

  useEffect(() => {
    // The user who creates the room doesn't need to specify his username,
    // the room is therefore loaded automatically
    if (isAdmin && location.state?.fromHome === true) {
      loadRoom();
    }
  }, [isAdmin]);

  /**
   * Load the room properties by the id in the url path : the name,
   * the size, and the admin name.
   */
  function loadRoom(event?: React.FormEvent) {
    if (event) event.preventDefault();

    axios
      .get(`${process.env.HOST}/api/load/${roomId}`)
      .then((res) => {
        const { roomName, roomSize, roomAdmin, musics } = res.data;
        if (roomName && roomSize && roomAdmin && musics) {
          setName(roomName);
          setSize(roomSize);
          setAdmin(roomAdmin);
          setMusics(musics);
          socket.emit('join_room', {
            roomId,
            username: isAdmin ? roomAdmin : username,
          });
        } else {
          throw new Error(
            `Something went wrong when loading the room ${roomId}`
          );
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setCurrentAlert(
            alert.show(
              `La salle d'écoute est complète, nous ne pouvez plus y accéder`,
              { type: 'error' }
            )
          );
        } else if (err.response.status === 404) {
          // The room id doesn't exist
          console.error(`The room ${roomId} doesn't exist`);
          setCurrentAlert(
            alert.show(
              `La salle d'écoute que vous tentez de rejoindre n'existe pas`,
              { type: 'error' }
            )
          );
        } else {
          console.error(err);
        }
      });
  }

  function onAlert() {
    if (currentAlert) {
      alert.remove(currentAlert);
      setCurrentAlert(null);
    }
  }

  const loginForm = () => (
    <>
      <Helmet>
        <title>Connexion - Music Player</title>
      </Helmet>
      <form onSubmit={loadRoom}>
        <label htmlFor="username">
          Choisir un nom d'utilisateur pour rejoindre la salle d'écoute :
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Nom d'utilisateur"
          required
          maxLength={30}
          pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+"
          onChange={(event) => setUsername(event.target.value)}
        />
        <input type="submit" value="Valider" />
      </form>
    </>
  );

  const roomView = () => (
    <>
      <Helmet>
        <title>{name} - Music Player</title>
      </Helmet>
      <h2>{name}</h2>
      <div className="Room__Admin">
        Créé par <b>{admin}</b>
      </div>
      <AudioControl musics={musics} isAdmin={isAdmin} />
      <h4>
        {activeUsers.length} / {size} participants
      </h4>
      <ul className="Room__Users">
        {activeUsers.map((user) => (
          <li>{user.name}</li>
        ))}
      </ul>
      <CopyToClipboard
        text={`${process.env.HOST}/room/${roomId}`}
        onCopy={() =>
          setCurrentAlert(
            alert.show("Lien d'invitation copié !", {
              type: 'success',
            })
          )
        }
      >
        <button className="Room__Share">Partager la salle d'écoute</button>
      </CopyToClipboard>
    </>
  );

  return (
    <div className="Room PageContainer">
      <EventHandler onClick={onAlert} show={currentAlert} />
      {/* Show the form to choose the username if it's a guest or directly 
      show the room view (audion controller) */}
      {location.state?.fromHome !== true &&
      (!username || !name || !size || !admin)
        ? loginForm()
        : roomView()}
    </div>
  );
}

export default React.memo(Room);
