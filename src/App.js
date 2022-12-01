import 'react-native-gesture-handler';
import * as React from 'react';
import { registerRootComponent } from 'expo';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import HomeScreen from './HomeScreen';
import UserScreen from './UserScreen';
import SettingsScreen from './SettingsScreen';
import WebScreen from './WebScreen';
import AboutScreen from './AboutScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#5c6f82',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name='home'
          component={HomeScreen}
          options={{ title: Constants.expoConfig.extra.version }}
        />
        <Stack.Screen
          name='user'
          component={UserScreen}
          options={{ title: 'Configura l\'utente' }}
        />
        <Stack.Screen
          name='settings'
          component={SettingsScreen}
          options={{ title: 'Impostazioni' }}
        />
         <Stack.Screen
          name="about"
          component={AboutScreen}
          options={{ title: 'Informazioni' }}
        />
        <Stack.Screen
          name="web"
          component={WebScreen}
          options={{ title: 'Vai al registro' }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}


registerRootComponent(App);
export default App;
