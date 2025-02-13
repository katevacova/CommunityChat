import { View, Text, ActivityIndicator, FlatList, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { ChatProps } from '../Props.tsx';
import React, { useState, useEffect } from 'react';
import firestore from "@react-native-firebase/firestore";
import { useUser } from '../hooks/UserContext.tsx';
import { Message } from '../types.ts';

const Chat: React.FC<ChatProps> = ({ route }) => {
  const { room } = route.params;
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const textRef = React.useRef("");

  const [loadingMore, setLoadingMore] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chatRooms')
      .doc(room.id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(3)
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text ?? '',
            senderId: data.senderId ?? '',
            senderName: data.senderName ?? '',
            timestamp: data.timestamp ?? '',
          } as Message;
        });
        setMessages(messages);
        setLoading(false);
        setLastMessage(snapshot.docs[snapshot.docs.length - 1]);
      });

    return () => unsubscribe();
  }, []);

  const loadMoreMessages = async () => {
    console.log('loading more messages');
    if (!lastMessage || loadingMore) return;

    setLoadingMore(true);
    const messagesRef = firestore()
      .collection("chatRooms")
      .doc(room.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .startAfter(lastMessage)
      .limit(3)
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text ?? '',
            senderId: data.senderId ?? '',
            senderName: data.senderName ?? '',
            timestamp: data.timestamp ?? '',
          } as Message;
        });
      setMessages(prevMessages => [...prevMessages, ...newMessages]); // Append older messages to existing list
      setLastMessage(snapshot.docs[snapshot.docs.length - 1]);
      });
      setLoadingMore(false);
  };

  const sendMessage = async () => {
    if (!textRef.current.trim()) return;
  
    const messageData = {
      text: textRef.current,
      senderId: user?.uid,
      senderName: user?.displayName || "",
      timestamp: firestore.FieldValue.serverTimestamp(),
    };
  
    await firestore()
      .collection("chatRooms")
      .doc(room.id)
      .collection("messages")
      .add(messageData);
  
    textRef.current = "";
  };
    
    
      const renderItem = ({ item }: { item: Message} ) => (
        <View style={styles.messageContainer}>
          <Text style={styles.sender}>{item.senderName}</Text>
          <Text style={styles.message}>{item.text}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}</Text>
        </View>
      );
    
      return (
        <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#30668D" style={{ flex: 1 }} />
      ) : (
          <View style={{marginBottom: 100, alignSelf: "flex-end", width: "100%", alignItems: "flex-end"}}>
          <FlatList
            data={messages}
            inverted
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.2}
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#30668D" /> : null}
          />
          </View>
      )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={value => textRef.current = value}
              placeholder="Type a message"
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
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
          width: '100%',
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
          width: '100%',
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