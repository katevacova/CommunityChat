import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  fcmToken: string;
}

interface UserContextProps {
  user: UserProfile | null;
  initializing: boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  async function onAuthStateChanged(authUser: FirebaseAuthTypes.User | null) {
    if (authUser) {
      const userRef = firestore().collection('users').doc(authUser.uid);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        setUser(userDoc.data() as UserProfile);
      } else {
        // Create a new user profile if it doesn't exist
        const newUserProfile: UserProfile = {
          uid: authUser.uid,
          email: authUser.email || '',
          displayName: authUser.displayName || '',
          photoURL: authUser.photoURL || '',
          fcmToken: await messaging().getToken(),
        };
        await userRef.set(newUserProfile);
        setUser(newUserProfile);
      }
    } else {
      setUser(null);
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <UserContext.Provider value={{ user, initializing }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  console.log(context?.user?.uid);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};