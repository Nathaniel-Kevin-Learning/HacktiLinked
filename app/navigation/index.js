import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screen/RegisterScreen';
import LoginScreen from '../screen/LoginScreen';
import PostDetailScreen from '../screen/PostDetailScreen';
import { useAuthContext } from '../context/AuthContext';
import { useEffect } from 'react';
import Home from '../components/TabComponent';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { authUser, setAuthUser } = useAuthContext();
  useEffect(() => {
    SecureStore.getItemAsync('token').then((result) => {
      if (result) {
        setAuthUser(true);
      } else {
        setAuthUser(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={authUser ? 'Login' : 'HomeTab'}>
        {authUser ? (
          <>
            <Stack.Screen
              name="HomeTab"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetailPost"
              component={PostDetailScreen}
              options={({ navigation }) => ({
                title: null,
                headerShown: true,
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
