import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface UserPhotoButtonProps {
  photoUrl: string;
}

const UserPhotoButton: React.FC<UserPhotoButtonProps> = ({ photoUrl }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('Settings');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Image source={{ uri: photoUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default UserPhotoButton;