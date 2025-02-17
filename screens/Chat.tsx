import { View, Text, ActivityIndicator, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform , SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { ChatProps } from '../Props.tsx';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import firestore, { Timestamp } from "@react-native-firebase/firestore";
import { useUser } from '../hooks/UserContext.tsx';
import { Message } from '../types.ts';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";

const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
  const { room } = route.params;
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const textRef = React.useRef("");
  const textInputRef = React.useRef<TextInput>(null);

  const [loadingMore, setLoadingMore] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  //const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: room.name,
    });
  }, [navigation, room.name]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chatRooms')
      .doc(room.id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text ?? '',
            imageUrl: data.imageUrl ?? '',
            senderId: data.senderId ?? '',
            senderName: data.senderName ?? '',
            senderPhotoURL: data.senderPhotoURL ?? '',
            timestamp: data.timestamp ?? '',
            type: data.type ?? 'text',
          } as Message;
        });
        setMessages(messages);
        setLoading(false);
        setLastMessage(snapshot.docs[snapshot.docs.length - 1]);
      });

    return () => unsubscribe();
  }, []);

  const loadMoreMessages = async () => {
    if (!lastMessage || loadingMore) return;

    setLoadingMore(true);
    const messagesRef = firestore()
      .collection("chatRooms")
      .doc(room.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .startAfter(lastMessage)
      .limit(10)
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text ?? '',
            imageUrl: data.imageUrl ?? '',
            senderId: data.senderId ?? '',
            senderName: data.senderName ?? '',
            senderPhotoURL: data.senderPhotoURL ?? '',
            timestamp: data.timestamp ?? '',
            type: data.type ?? 'text',
          } as Message;
        });
      setMessages(prevMessages => [...prevMessages, ...newMessages]); // Append older messages to existing list
      setLastMessage(snapshot.docs[snapshot.docs.length - 1]);
      });
      setLoadingMore(false);
  };

  const sendMessage = async (content: string, type: "text" | "image" = "text") => {
    if (!content.trim()) return;
  
    const messageData = {
      text: type === "text" ? content : "",
      imageUrl: type === "image" ? content : "",
      senderId: user?.uid,
      senderName: user?.displayName || "",
      senderPhotoURL: user?.photoURL || "",
      timestamp: firestore.FieldValue.serverTimestamp(),
      type,
    };
  
    await firestore()
      .collection("chatRooms")
      .doc(room.id)
      .collection("messages")
      .add(messageData);

    await firestore()
      .collection("chatRooms")
      .doc(room.id)
      .update({
        lastMessageTimestamp: firestore.FieldValue.serverTimestamp()});

    textRef.current = "";
    if (textInputRef.current) {
      textInputRef.current.clear();
    }

    /* if (!notificationsEnabled) {
      Alert.alert(
        "Enable Notifications?",
        "Would you like to receive notifications for this chat room?",
        [
          { text: "No", onPress: () => setNotificationsEnabled(false), style: "cancel" },
          { text: "Yes", onPress: async () => {
            setNotificationsEnabled(true);
            await firestore().collection("users").doc(user.uid).update({
              subscribedRooms: firestore.FieldValue.arrayUnion(room.id),
            });
          }},
        ]
      );
    }*/
  };

  const uploadImage = async (imageUri: string) => {
    console.log("Uploading image:", imageUri);
    if (!imageUri) return null;
  
    const fileName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
    const storageRef = storage().ref(`chat_images/${fileName}`);
  
    try {
      await storageRef.putFile(imageUri);
      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      return null;
    }
  };

  const pickImage = () => {
    console.log("Picking image");
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      console.log("Image response:", response);
      if (!response.didCancel && response.assets) {
        const imageUri = response.assets[0].uri || "";
        const imageURL = await uploadImage(imageUri);
        if (imageURL) sendMessage(imageURL, "image");
      }
    });
  };
  
  const takePhoto = () => {
    launchCamera({ mediaType: "photo" }, async (response) => {
      console.log("Camera response:", response);
      if (!response.didCancel && response.assets) {
        const imageUri = response.assets[0].uri || "";
        const imageURL = await uploadImage(imageUri);
        if (imageURL) sendMessage(imageURL, "image");
      }
    });
  };
    
  const renderItem = ({ item }: { item: Message} ) => (
    <View style={styles.messageContainer}>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={styles.sender}>{item.senderName}</Text>
        <Image source={{ uri: item.senderPhotoURL }} style={styles.userPhoto} />
      </View>
      {item.type === "image" ? (
      <Image source={{ uri: item.imageUrl }} style={styles.chatImage} />
    ) : (
      <Text style={styles.message}>{item.text}</Text>
    )}
      <Text style={styles.timestamp}>{new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}</Text>
    </View>
  );
    
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#30668D" style={{ flex: 1 }} />
      ) : messages.length === 0 ? (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>There are no messages yet.</Text>
        </View>
      ) : (
          <FlatList
            style={{ flex: 1, flexGrow: 1, width: "100%", marginBottom: 45, alignSelf: "flex-end", height: "100%"}}
            data={messages}
            inverted
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.2}
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#30668D" /> : null}
          />
      )}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainerWrapper}>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={takePhoto} style={styles.sendButton}>
            <Icon name="camera" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.sendButton}>
            <Icon name="image" size={24} color="#fff" />
          </TouchableOpacity>
          <TextInput
            ref={textInputRef}
            style={styles.input}
            onChangeText={(value) => (textRef.current = value)}
            placeholder="Type a message"
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(textRef.current)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(textRef.current)}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    margin: 2,
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  chatImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  inputContainerWrapper: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMessagesText: {
    fontSize: 18,
    color: '#888',
  },
});

export default Chat;