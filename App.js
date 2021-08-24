import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import axios from 'axios'
import io from 'socket.io-client'
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import LoginScreen from './screens/Login'
import RegisterScreen from './screens/Register'
import DashboardScreen from './screens/Dashboard'
import GameScreen from './screens/Game'
import MainMenuScreen from './screens/MainMenu'
import SubscribedGamesScreen from './screens/SubscribedGames'

import { ContextProvider } from './providers/Context';

const Stack = createNativeStackNavigator()

axios.defaults.baseURL = "http://192.168.1.67:4000"

export default function App() {


  useEffect(() => {
    async function fetchData()
    {
      const token = await AsyncStorage.getItem('token')
      axios.defaults.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    fetchData()
  }, [AsyncStorage.getItem('token')])

  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
          <Stack.Screen name="Dashboard" component={DashboardScreen}/>
          <Stack.Screen name="MainMenu" component={MainMenuScreen}/>
          <Stack.Screen name="Game" component={GameScreen}/>
          <Stack.Screen name="MyGames" component={SubscribedGamesScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
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
