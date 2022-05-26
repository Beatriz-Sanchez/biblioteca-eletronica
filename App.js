import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabNavigator from './components/BottomTabNavigator';
import {Rajdhani_600SemiBold } from "@expo-google-fonts\rajdhani";
import * as Font from "expo-font";

export default class App extends Component{
  render(){
    return (
      <BottomTabNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
