import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class TransactionScreen extends Component {
  constructor() {
    super();
    this.state = {
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
    };
  }
  getCameraPermission = async (domState) => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({
      domState: domState,
      hasCameraPermissions: status === "granted",
      scanned: false,
      scannedData: "",
    });
  };
  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scannedData: data,
      domState: "normal",
      scanned: true,
    });
  };
  render() {
    const { domState, hasCameraPermissions, scannedData, scanned } = this.state;
    if (domState === "scanner") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={bgImage} style={styles.bgImage}>
          <View style={styles.upperContainer}>
            <Image source={appIcon} style={styles.appIcon} />
            <Image source={appName} style={styles.appName} />
          </View>
          <View style={styles.lowerContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={"ID Livro"}
              placeholderTextColor={"#ffffff"}
            />
            <TouchableOpacity
            style={styles.scanbutton}
            onPress={() => {
              this.getCameraPermission("scanner");
            }}
          >
            <Text style={styles.scanbuttonText}>Digitalizar</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={"ID Aluno"}
              placeholderTextColor={"#ffffff"}
            />
            <TouchableOpacity
            style={styles.scanbutton}
            onPress={() => {
              this.getCameraPermission("scanner");
            }}
          >
            <Text style={styles.scanbuttonText}>Digitalizar</Text>
          </TouchableOpacity>
          </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80,
  },
  appName: {
    width: 180,
    resizeMode: "contain",
  },
  buttonText: {
    color: "#ffff",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Rajdhani_600SemiBold",
  },
  button: {
    width: "43%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15,
    marginTop: 25,
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  textInputContainer: {
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: "row",
    borderColor: "#FFFFFF",
    marginTop: 10,
  },
  textInput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#F48D20",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "Rajdhani_600SemiBold"
  },
});
