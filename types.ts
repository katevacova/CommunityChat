import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type RootStackParamList = {
    SignIn: undefined;
    Chat: { room: ChatRoom };
    Rooms: undefined;
    Settings: undefined;
  };

  export type ChatRoom = {
    id: string;
    name: string;
    photoUrl?: string;
    description?: string;
    lastMessageTimestamp: FirebaseFirestoreTypes.Timestamp;
    members: { uid: string; displayName: string; photoURL: string }[];
    messages: Message[];
  }

  export type Message = {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    senderPhotoURL: string;
    timestamp: FirebaseFirestoreTypes.Timestamp;
  }