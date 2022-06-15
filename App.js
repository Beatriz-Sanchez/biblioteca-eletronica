import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomTabNavigator from "./components/BottomTabNavigator";
import { Rajdhani_600SemiBold } from "@expo-google-fonts/rajdhani";
import * as Font from "expo-font";

import LoginScreen from "./screens/Login";
import { createSwitchNavigator, createAppContainer } from "react-navigation";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
    };
  }
  async loadFonts() {
    await Font.loadAsync({
      Rajdhani_600SemiBold: Rajdhani_600SemiBold,
    });
    this.setState({ fontLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }
  render() {
    const { fontLoaded } = this.state;
    if (fontLoaded) {
      return <AppContainer />; 
    }
    return <Text>loading...</Text>;
  }
}

const AppSwitchNavigator = createSwitchNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    BottomTabNavigator: {
      screen: BottomTabNavigator,
    },
  },
  {
    initialRouteName: "Login",
  }
);

const AppContainer = createAppContainer(AppSwitchNavigator);
