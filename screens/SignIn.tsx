import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { SignInProps } from '../Props';
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useUser } from '../hooks/UserContext.tsx';
import { Pressable, Alert } from 'react-native'
import React from 'react';

const SignIn: React.FC<SignInProps> = ({ navigation }) => {

  GoogleSignin.configure({
    webClientId: '683483442680-thk7bc476b9k7jp99kefllrqa95ck16a.apps.googleusercontent.com',
    offlineAccess: true,
  });

  const user = useUser().user;

  async function onGoogleButtonPress() {
    if (user) {
      return null;
    }
      
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      
      const { type, data } = await GoogleSignin.signIn();
      
      if (type === 'success') {
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      
        // Sign-in the user with the credential
        const userCredential = await auth().signInWithCredential(googleCredential);
        return
      } else if (type === 'cancelled') {
        return;
      }
    } catch (error) {
      console.error('ERROR: ', error);
      Alert.alert('An error occurred. Please try again later.');
      return error;
    }
  }

  const renderGoogleSigninButton = () => {
    return (
        <Pressable style={styles.socialButton} onPress={() => onGoogleButtonPress()
          .then((value) => {
            const userCredential = value as FirebaseAuthTypes.UserCredential | null;
            if (userCredential) {
              console.log('value.additionalUserInfo: ', userCredential.additionalUserInfo);
              console.log('value.user: ', userCredential.user);
            }
          }).catch((error) => {
            if (isErrorWithCode(error)) {
              switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                  // user cancelled the login flow
                  Alert.alert("User cancelled the login flow. Please try again.");
                  break;
                case statusCodes.IN_PROGRESS:
                  // operation (eg. sign in) already in progress
                  Alert.alert("Sign In already in progress. Please wait.");
                  break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                  // play services not available or outdated
                  Alert.alert("Play services not available or outdated. Please update your play services.");
                  break;
                default:
                  // some other error happened
                  Alert.alert("An unknown error occurred. Please try again later.");
                }
              } else {
                // an error that's not related to google sign in occurred
                Alert.alert("An error that's not related to google sign in occurred. Please try again later.");
              }
              })}>
                <Icon name="google" size={20} color="#000" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
        </Pressable>
      )
    }

    async function onFacebookButtonPress() { 
      Alert.alert("Facebook sign-in is not yet provided. Please try another sign-in method.");
      /*// Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }
    
      // Once signed in, get the users AccessToken
      const data = await AccessToken.getCurrentAccessToken();
    
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
    
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    
      // Sign-in the user with the credential
      return auth().signInWithCredential(facebookCredential);*/
    }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Welcome to CommunityChat</Text>
      <Text style={styles.title}>Sign in</Text>
      {renderGoogleSigninButton()}
      <TouchableOpacity style={styles.socialButton} onPress={onFacebookButtonPress}>
        <Icon name="facebook" size={20} color="#000" />
        <Text style={styles.socialButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>Easy, right?</Text>
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
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 7,
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