export type RootStackParamList = {
    SignIn: undefined;
    Chat: undefined;
    Rooms: undefined;
    Settings: undefined;
  };

export type ChatRoom = {
    id: string;
    name: string;
    photoUrl?: string;
    numberOfUsers: number;
    lastMessage?: string;
    members: string[];
  };