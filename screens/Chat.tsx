import { View, Text, FlatList, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { ChatProps } from '../Props';
import React, { useState } from 'react';

const Chat: React.FC<ChatProps> = ({ navigation }) => {

    const mockMessages = [
        {
          id: '1',
          text: 'Hey everyone, welcome to the chat!',
          sender: 'Alice',
          timestamp: '2023-10-01T10:00:00Z',
        },
        {
          id: '2',
          text: 'Hi Alice! How are you?',
          sender: 'Bob',
          timestamp: '2023-10-01T10:01:00Z',
        },
        {
          id: '3',
          text: 'I\'m good, thanks! How about you?',
          sender: 'Alice',
          timestamp: '2023-10-01T10:02:00Z',
        },
        {
          id: '4',
          text: 'Doing well, just working on a project.',
          sender: 'Bob',
          timestamp: '2023-10-01T10:03:00Z',
        },
        {
          id: '5',
          text: 'That sounds interesting. What project?',
          sender: 'Alice',
          timestamp: '2023-10-01T10:04:00Z',
        },
      ];

      const [messages, setMessages] = useState(mockMessages);
      const [newMessage, setNewMessage] = useState('');
    
      const handleSend = () => {
      };
    
      const renderItem = ({ item }: { item: { id: string; text: string; sender: string; timestamp: string } }) => (
        <View style={styles.messageContainer}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.message}>{item.text}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
      );
    
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    };
    

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          paddingTop: 20,
        },
        logo: {
          fontSize: 45,
          fontWeight: '800',
          marginBottom: 20,
          color: "#30668D",
          alignSelf: 'center',
          textAlign: 'center',
        },
        messagesContainer: {
          flexGrow: 1,
          padding: 10,
        },
        messageContainer: {
          marginBottom: 15,
          padding: 10,
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        },
        sender: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        message: {
          fontSize: 14,
          color: '#555',
          marginBottom: 5,
        },
        timestamp: {
          fontSize: 12,
          color: '#888',
          textAlign: 'right',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            backgroundColor: '#fff',
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
          },
          input: {
            flex: 1,
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 10,
            marginRight: 10,
          },
          sendButton: {
            backgroundColor: '#30668D',
            padding: 10,
            borderRadius: 20,
          },
      });
      
      export default Chat;