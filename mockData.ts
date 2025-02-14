import firestore from '@react-native-firebase/firestore';

export const mockRooms = [
  {
    name: 'General Chat',
    photoUrl: 'https://engineering.fb.com/wp-content/uploads/2009/02/chat.jpg',
    description: 'A place for everyone to chat',
    lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Tech Talk',
    photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSua60tQ-2e7gX5AgXwI7kn_Ym01QIAR9JA&s',
    description: 'Discuss the latest tech trends',
    lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Gaming',
    photoUrl: 'https://www.bluent.com/images/wher-are-we-going.webp',
    description: 'For all the gamers out there',
    lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Music Lovers',
    photoUrl: 'https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg',
    description: 'Share your favorite tunes',
    lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Travel Buddies',
    photoUrl: 'https://www.assahifa.com/english/wp-content/uploads/2021/03/travel-plane-wttc.jpg',
    description: 'Discuss your favorite travel destinations',
    lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
  },
];

const addMockRooms = async () => {
  const chatRoomsRef = firestore().collection('chatRooms');

  const snapshot = await chatRoomsRef.limit(1).get();
  if (snapshot.empty) {
    for (const room of mockRooms) {
      await chatRoomsRef.add(room);
    }
    console.log('Mock rooms added to Firestore');
  } else {
    console.log('chatRooms collection already exists.');
  }
};

export default addMockRooms;