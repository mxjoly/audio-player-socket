interface Music {
  name: string;
  url: string;
}

export let rooms: Room[] = [];

export function clearRoom() {
  rooms = [];
}

export function getRoom(roomId: string) {
  const index = rooms.findIndex((room) => room.id === roomId);
  if (index > -1) {
    return rooms[index];
  }
  return null;
}

export function deleteRoom(roomId: string) {
  const index = rooms.findIndex((room) => room.id === roomId);
  if (index > -1) {
    rooms.splice(index, 1);
  }
}

export function findUser(id: string) {
  const room = rooms.filter((room) =>
    room.users.some((user) => user.id === id)
  )[0];
  if (room) {
    return Object.assign({}, room.getUser(id), { room });
  }
  return null;
}

export default class Room {
  id: string;
  name: string;
  size: number;
  admin: string;
  musics: Music[];
  users: { id: string; name: string }[];

  constructor(
    id: string,
    name: string,
    size: number,
    admin: string,
    musics: Music[],
    users = []
  ) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.admin = admin;
    this.musics = musics;
    this.users = users;
  }

  getUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index > -1) {
      return this.users[index];
    }
    return null;
  }

  addUser(name: string, id: string) {
    if (!this.users.some((user) => user.id === id)) {
      this.users.push({ id, name });
    }
  }

  removeUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }
}
