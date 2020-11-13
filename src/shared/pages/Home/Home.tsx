import React, { useState, useEffect, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { MdClose } from 'react-icons/md';
import { useAlert } from 'react-alert';
import EventHandler from '../../components/atoms/EventHandler';
import axios from 'axios';
import './styles.scss';

function Home() {
  const history = useHistory();
  const alert = useAlert();

  const [roomName, setRoomName] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomAdmin, setRoomAdmin] = useState('');
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [currentAlert, setCurrentAlert] = useState<any>(null);

  useEffect(() => {
    function makeid(length: number) {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    }

    setRoomId(makeid(8));
  }, [roomName]);

  function onCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (filesToUpload.length === 0) {
      setCurrentAlert(
        alert.show(
          "Tu dois sélectionner au moins une musique pour créer une salle d'écoute",
          {
            type: 'error',
          }
        )
      );
      return;
    }

    const data = new FormData();
    data.append('roomName', roomName);
    data.append('roomSize', roomSize);
    data.append('roomAdmin', roomAdmin);
    filesToUpload.forEach((file) => data.append(file.name, file));

    axios
      .post(`${process.env.HOST}/api/create/${roomId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        history.push(`/room/${roomId}?admin=true`, { fromHome: true });
      })
      .catch(console.error);
  }

  function onSetSelectedFiles(event: any) {
    event.preventDefault();
    setFilesToUpload(filesToUpload.concat(Array.from(event.target.files)));
  }

  function onRemoveFileToUpload(file: File) {
    setFilesToUpload(filesToUpload.filter((f) => f.name !== file.name));
  }

  function onAlert() {
    if (currentAlert) {
      alert.remove(currentAlert);
      setCurrentAlert(null);
    }
  }

  return (
    <div className="Home PageContainer" onClick={onAlert}>
      <Helmet>
        <title>Accueil - Music Player</title>
      </Helmet>
      <EventHandler onClick={onAlert} show={currentAlert} />
      <h2>Créer une nouvelle salle d'écoute</h2>
      <form className="Form" onSubmit={onCreateRoom}>
        <input
          type="text"
          name="roomName"
          placeholder="Nom de la salle d'écoute"
          required
          maxLength={50}
          minLength={1}
          onChange={(event) => setRoomName(event.target.value)}
        />
        <input
          type="text"
          name="roomSize"
          placeholder="Nombre de participants"
          maxLength={2}
          minLength={1}
          required
          pattern="[0-5]{1}[0-9]?"
          onChange={(event) => setRoomSize(event.target.value)}
        />
        <input
          type="text"
          name="username"
          placeholder="Votre nom d'utilisateur"
          maxLength={30}
          minLength={1}
          required
          pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+"
          onChange={(event) => setRoomAdmin(event.target.value)}
        />

        <h3>Quelles musiques voulez-vous utiliser ?</h3>
        <input
          type="file"
          multiple
          onChange={onSetSelectedFiles}
          accept="audio/*"
        />
        <ul className="Form__Files">
          {Array.from(filesToUpload).map((file, i) => (
            <li className="Form__Files__Item" key={`file-${i}`}>
              {file.name}
              <IconContext.Provider
                value={{ className: 'Form__Files__Button' }}
              >
                <MdClose onClick={() => onRemoveFileToUpload(file)} size={20} />
              </IconContext.Provider>
            </li>
          ))}
        </ul>

        <input type="submit" value="Créer" />
      </form>
    </div>
  );
}

export default Home;
