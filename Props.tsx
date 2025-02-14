import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatRoom, RootStackParamList } from './types.ts';
import { RouteProp } from '@react-navigation/native';

export type SignInProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
};

export type ChatProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

export type RoomsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Rooms'>;
};

export type SettingsProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};
