import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Animated, TouchableWithoutFeedback, Pressable } from 'react-native';
import { RoomsProps } from '../Props';

const Rooms: React.FC<RoomsProps> = ({ navigation }) => {

    const mockup_rooms = [
    {
      id: '1',
      name: 'General Chat',
      picture: 'https://engineering.fb.com/wp-content/uploads/2009/02/chat.jpg',
      numberOfUsers: 10,
      messages: [
        'Hey everyone, welcome to the general chat!',
        'How is everyone doing today?',
        'Don\'t forget about the meeting tomorrow.',
      ],
    },
    {
      id: '2',
      name: 'Tech Talk',
      picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSua60tQ-2e7gX5AgXwI7kn_Ym01QIAR9JA&s',
      numberOfUsers: 25,
      messages: [
        'Did you see the latest tech news?',
        'The new iPhone was just announced!',
        'What do you think about the new AI technology?',
      ],
    },
    {
      id: '3',
      name: 'Gaming',
      picture: 'https://www.bluent.com/images/wher-are-we-going.webp',
      numberOfUsers: 15,
      messages: [
        'Who is up for a game tonight?',
        'I just got the new console!',
        'Let\'s play some multiplayer games.',
      ],
    },
    {
      id: '4',
      name: 'Music Lovers',
      picture: 'https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg',
      numberOfUsers: 20,
      messages: [
        'Check out this new album!',
        'What\'s your favorite song?',
        'Let\'s create a playlist together.',
      ],
    },
    {
      id: '5',
      name: 'Travel Buddies',
      picture: 'https://www.assahifa.com/english/wp-content/uploads/2021/03/travel-plane-wttc.jpg',
      numberOfUsers: 8,
      messages: [
        'Planning a trip to Japan next month!',
        'Anyone interested in a weekend getaway?',
        'Let\'s share our travel experiences.',
      ],
    },
  ];

  async function handlePress() {
    navigation.navigate('Chat');
  }


  const renderItem = ({ item }: { item: { id: string; name: string; picture: string; numberOfUsers: number; messages: string[] } }) => (
    <TouchableWithoutFeedback onPress={() => handlePress()}>
      <View style={styles.roomContainer}>
        <Image source={{ uri: item.picture }} style={styles.roomImage} />
        <View style={styles.roomInfo}>
          <Text style={styles.roomName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.roomUsers}>{item.numberOfUsers} users</Text>
          <Text style={styles.roomMessage} numberOfLines={1}>{item.messages[item.messages.length - 1]}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={mockup_rooms}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

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
    alignItems: 'center', // Center items vertically
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

function handlePress(item: { id: string; name: string; picture: string; numberOfUsers: number; messages: string[]; }): void {
  throw new Error('Function not implemented.');
}
