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
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config";

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      bookId: "",
      studentId: "",
      bookName: "",
      studentName: "",
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
    const { domState } = this.state;
    if (domState === "bookId") {
      this.setState({
        bookId: data,
        domState: "normal",
        scanned: true,
      });
    }
    if (domState === "studentId") {
      this.setState({
        studentId: data,
        domState: "normal",
        scanned: true,
      });
    }
  };

  handleTransaction = async () => {
    const { bookId } = this.state;
    const { studentId } = this.state;

    this.getBookDetails(bookId);
    this.getStudentDetails(studentId);

    var transactionType = await this.checkBookAvailability(bookId);

    if (transactionType == "issue") {
      this.initiateBookIssue();
    } else if (transactionType == "return"){
      this.InitiateBookReturn();
    } else if (!transactiontype) {
    alert("documento não localizado, tente novamente");
    };

  }

  initiateBookIssue = () => {
    alert("livro retirado");
  };

  InitiateBookReturn = () => {
    alert("livro devolvido");
  };

  getBookDetails = (bookId) => {
    bookId = bookId.trim(); 
    const bookRef = doc(db, "books", bookId);

    getDoc(bookRef)
      .then((doc) => {
        this.setState({
          bookName: doc.data().book_name,
        });
        console.log(this.state.bookName);
      })
      .catch((error) => console.warn(error.message));
  };

  getStudentDetails = (studentId) => {
    studentId = studentId.trim();
    const studentRef = doc(db, "students", studentId);

    getDoc(studentRef)
      .then((doc) => {
        this.setState({
          studentName: doc.data().student_name,
        });
        console.log(this.state.studentName);
      })
      .catch((error) => console.warn(error.message));
  };

  checkBookAvailability = async (bookId) => {
    const bookRef = doc(db, "books", bookId);
    const bookDoc = await getDoc(bookRef);
    let transactionType = ""

    if (bookDoc.data()) {
      let book = bookDoc.data();
      transactionType = (book.is_book_available) ? "issue" : "return";

    } else {
      transactionType = false;
    }

    return transactionType;
  };
  render() {
    const { domState, hasCameraPermissions, bookId, studentId, scanned } =
      this.state;
    if (domState !== "normal") {
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
                value={bookId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => {
                  this.getCameraPermission("bookId");
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
                value={studentId}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => {
                  this.getCameraPermission("studentId");
                }}
              >
                <Text style={styles.scanbuttonText}>Digitalizar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleTransaction}
            >
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
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
    height: 55,
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center",
    width: "100%",
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
    color: "#FFFFFF",
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#F48D20",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  scanbuttonText: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "Rajdhani_600SemiBold",
  },
});
