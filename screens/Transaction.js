import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class TransactionScreen extends Component {
  constructor(){
    super();
    this.state = {
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
    }
  }
  getCameraPermission = async (domState) => {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    this.setState({
      domState: domState,
      hasCameraPermissions: status === "granted",
      scanned: false,
      scannedData: "",
    });
  }
  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scannedData: data,
      domState: "normal",
      scanned: true
    })
  }
  render() {
    const { domState, hasCameraPermissions, scannedData, scanned } = this.state
    if(domState === "scanner"){
      return(
            <BarCodeScanner onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned} style={StyleSheet.absoluteFillObject}/>
        )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
        {hasCameraPermissions ? scannedData: "Conceda acesso à câmera"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={()=>{this.getCameraPermission("scanner")}}>
        <Text style={styles.buttonText}>Escanear{'\n'}QR code</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653d4"
  },
  text: {
    color: "#ffff",
    fontSize: 30
  },
  buttonText: {
    color: "#ffff",
    fontSize: 24,
    textAlign: "center"
  },
  button:{
    width:"43%",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#F48D20",
    borderRadius:15
  }
});