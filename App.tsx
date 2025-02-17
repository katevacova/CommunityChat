import React, { useState, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import addMockRooms from './mockData.ts';
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import SignIn from './screens/SignIn';
import Chat from './screens/Chat';
import Rooms from './screens/Rooms';
import Settings from './screens/Settings.tsx';
import { RootStackParamList } from './types'; 
import { UserProvider, useUser } from './hooks/UserContext.tsx';
import UserSettingsButton from './components/UserSettingsButton.tsx';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  (globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

  useEffect(() => {
    addMockRooms();
  }, []);

  //notification permission
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Notification permission granted.');
    } else {
      Alert.alert('Permission required', 'Please enable notifications in settings.');
    }
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  const userProvider = useUser();
  const user = userProvider.user;

  if (userProvider.initializing) return ( // Splash screen
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>CommunityChat</Text>
    </View>
  );

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignIn}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Rooms">
          <Stack.Screen 
            name="Rooms" 
            component={Rooms}
            options={{
              title: 'Rooms',
              headerRight: () => (
                <UserSettingsButton
                  photoUrl={user?.photoURL || 'https://example.com/default-photo.png'}
                />
              ),
            }}
          />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Settings" component={Settings}/>

        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#30668D',
  },
  splashText: {
    fontSize: 45,
    fontWeight: '800',
    color: '#fff',
  },
});

export default () => (
    <UserProvider>
        <App/>
    </UserProvider>
);
