import React, { useState, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import SignIn from './screens/SignIn';
import Chat from './screens/Chat';
import Rooms from './screens/Rooms';
import Settings from './screens/Settings.tsx';
import { RootStackParamList } from './types'; 
import auth from '@react-native-firebase/auth';
import { UserProvider, useUser } from './hooks/UserContext.tsx';
import UserSettingsButton from './components/UserSettingsButton.tsx';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Splash from './screens/Splash';

/*type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}*/

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  /*const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };*/

  const userProvider = useUser();
  const user = userProvider.user;

  if (userProvider.initializing) return ( // Splash screen
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionDescription}>Welcome to CommunityChat</Text>
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
                  photoUrl={user.photoURL || 'https://example.com/default-photo.png'}
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default () => (
    <UserProvider>
        <App/>
    </UserProvider>
);
