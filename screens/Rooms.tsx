import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { RoomsProps } from '../Props.tsx';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const Rooms: React.FC<RoomsProps> = ({ navigation }) => {

  type ChatRoom = {
    id: string;
    name: string;
    photoUrl?: string;
    numberOfUsers: number;
    lastMessage?: string;
  };

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chatRooms')
      .orderBy('lastMessageTimestamp', 'desc')
      .onSnapshot(snapshot => {
        const rooms = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name ?? 'Unknown Room',
            photoUrl: data.photoUrl ?? '',
            numberOfUsers: data.numberOfUsers ?? 0,
            lastMessage: data.lastMessage ?? '',
          } as ChatRoom;
        });
        setChatRooms(rooms);
        setLoading(false);
        console.log(chatRooms);
      });

    return () => unsubscribe();
  }, []);

  async function handlePress() {
    navigation.navigate('Chat');
  }


  const renderItem = ({ item }: { item: ChatRoom }) => (
    <Pressable onPress={() => handlePress()}>
      <View style={styles.roomContainer}>
        <Image source={{ uri: item.photoUrl ?? 'https://default-image-url.com' }} style={styles.roomImage} />
        <View style={styles.roomInfo}>
          <Text style={styles.roomName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.roomUsers}>{item.numberOfUsers} users</Text>
          <Text style={styles.roomMessage} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={chatRooms}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />);
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  roomContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  roomImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  roomInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomUsers: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  roomMessage: {
    fontSize: 14,
    color: '#555',
  },
});

export default Rooms;