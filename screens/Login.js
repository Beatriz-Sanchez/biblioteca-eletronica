import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
} from "react-native";

const bgImage = require("../assets/background1.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

import {auth} from "../config";
import {signInWithEmailAndPassword} from 'firebase/auth';

//toast p/ iPhone
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toast.show("Bem-vindo(a)!", {
            duration: Toast.durations.SHORT,
          });
        setTimeout(()=>{this.props.navigation.navigate("BottomTabNavigator");}, 500)
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  render() {
    const {email, password} = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground source={bgImage} style={styles.bgImage}>
          <View style={styles.upperContainer}>
            <Image source={appIcon} style={styles.appIcon} />
            <Image source={appName} style={styles.appName} />
          </View>

          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-500} style={styles.lowerContainer}>
            <RootSiblingParent>
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => this.setState({ email: text })}
              placeholder={"Insira seu Email"}
              placeholderTextColor={"#FFFFFF"}
              autoFocus
            />
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder={"Insira sua Senha"}
              placeholderTextColor={"#FFFFFF"}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={() => this.handleLogin(email, password)}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            </RootSiblingParent>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5653D4",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon: {
    width: 280,
    height: 280,
    resizeMode: "contain",
    marginTop: 80,
  },
  appName: {
    width: "75%",
    resizeMode: "contain",
    marginBottom: 30,
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textinput: {
    width: "75%",
    height: 55,
    padding: 10,
    borderColor: "#FFFFFF",
    borderWidth: 4,
    borderRadius: 10,
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Rajdhani_600SemiBold",
    backgroundColor: "#5653D4",
    marginTop: 10,
  },
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: "Rajdhani_600SemiBold",
    color: "#ffffff",
  },
});
