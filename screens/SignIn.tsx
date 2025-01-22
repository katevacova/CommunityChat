import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import {
    useNavigation,
  } from '@react-navigation/native';
import { SignInProps } from '../Props';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn: React.FC<SignInProps> = ({ navigation }) => {

    const goToRooms = () => { navigation.navigate('Rooms') };

    return (
        <View style={styles.container}>
        <Text style={styles.logo}>Welcome to CommunityChat</Text>
        <Text style={styles.title}>Sign in</Text>

        <TouchableOpacity style={styles.socialButton} onPress={goToRooms}>
          <Icon name="google" size={20} color="#000" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={goToRooms}>
          <Icon name="facebook" size={20} color="#000" />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Yep, it's this easy</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
      paddingTop: 150,
    },
    logo: {
      fontSize: 45,
      fontWeight: 800,
      marginBottom: 50,
      color: "#30668D",
      alignSelf: 'center',
      textAlign: 'center',
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 7,
    },
    subtitle: {
      fontSize: 16,
      color: "#888",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 20,
    },
    nextButton: {
      backgroundColor: "#000",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 20,
    },
    nextButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: "#ccc",
    },
    orText: {
      marginHorizontal: 10,
      color: "#888",
      fontSize: 16,
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingVertical: 15,
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    socialButtonText: {
      fontSize: 16,
      marginLeft: 10,
      color: "#000",
    },
    footerText: {
      marginTop: 5,
      textAlign: "center",
      color: "#000",
      fontSize: 16,
    },
  });

export default SignIn;