import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { SettingsProps } from '../Props';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../hooks/UserContext.tsx';
import auth from '@react-native-firebase/auth';

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
    
    function userLogout(): Promise<string> {
        return new Promise((resolve, reject) => {
            auth()
                .signOut()
                .then(() => {
                    resolve('Logout Successful');
                })
                .catch(error => {
                    reject({
                        title: 'Error',
                        desc: error.message,
                    });
                });
        });
    }

    const user = useUser().user!;

    const handleSignOut = () => {
        userLogout().then((message) => {
            Alert.alert(message);
        }).catch(error => {
            Alert.alert(error.title, error.desc);
        });
      };
    
      return (
        <View style={styles.container}>
          {user.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={styles.userPhoto}
        />
      ) : (
        <View style={styles.iconContainer}>
          <Icon name="user-circle" size={100} color="#888" />
        </View>
      )}
          <Text style={styles.title}>{user.displayName}</Text>
          <Text style={styles.subtitle}>{user.email}</Text>
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      );
    };

  const styles = StyleSheet.create({
    ...StyleSheet.flatten({
      container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 150,
      },
    }),
    userPhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 20,
    },
    iconContainer: {
        alignSelf: 'center',
        marginBottom: 20,
      },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 7,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: "#888",
      marginBottom: 30,
      textAlign: 'center',
    },
    signOutButton: {
      backgroundColor: "#000",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 20,
    },
    signOutButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default Settings;