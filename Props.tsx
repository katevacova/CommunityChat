import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

export type SignInProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
};

export type ChatProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
};

export type RoomsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Rooms'>;
};

export type SettingsProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};