import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import {
    useNavigation,
  } from '@react-navigation/native';
import { SignInProps } from '../Props';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useUser } from '../hooks/UserContext.tsx';
import { Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const SignIn: React.FC<SignInProps> = ({ navigation }) => {

    GoogleSignin.configure({
        webClientId: '683483442680-thk7bc476b9k7jp99kefllrqa95ck16a.apps.googleusercontent.com',
        offlineAccess: true,
    });


  /*const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []); */

  const user = useUser().user;


    async function onGoogleButtonPress() {
        if (user) {
          // user is already logged in so no need to do anything
          return null;
        }
      
        try {
          // Check if your device supports Google Play
          await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
          });
      
          const { type, data } = await GoogleSignin.signIn();
      
          /**
           * @type can be "cancelled" in which can @data will be 'null'; 
           * If @type is "success" then @data will be:
           * user: {
                  id: string;
                  name: string | null;
                  email: string;
                  photo: string | null;
                  familyName: string | null;
                  givenName: string | null;
              };
              scopes: string[];
              idToken: string | null;
              serverAuthCode: string | null;
           */
      
          if (type === 'success') {
            // const { id, name, email, photo, familyName, givenName } = data.user;
      
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      
            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
          } else if (type === 'cancelled') {
            // When the user cancels the flow for any operation that requires user interaction.
            return; // do nothing
          }
        } catch (error) {
          console.error('ERROR: ', error);
          return error;
        }
      }

      const renderGoogleSigninButton = () => {

        const buttonTitle = user ? `Signed in as: ${user.displayName}` : 'Continue with Google'

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
                <Text>{buttonTitle}</Text>
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