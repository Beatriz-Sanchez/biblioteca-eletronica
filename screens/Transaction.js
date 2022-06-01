import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  LogBox,
  ToastAndroid,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  doc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";
//toast p/ iPhone
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast'

import { db } from "../config";

//para evitar avisos de timer
LogBox.ignoreLogs(['Setting a timer']);

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
    const { bookName, studentName } = this.state;

    var transactionType = await this.checkBookAvailability(bookId);

    if (transactionType == "issue") {
      this.initiateBookIssue(bookId, studentId, bookName, studentName);
    } else if (transactionType == "return") {
      this.InitiateBookReturn(bookId, studentId, bookName, studentName);
    } else if (!transactionType) {

      //toast para Android
      //ToastAndroid.show("Livro não encontrado, cheque o ID e tente novamente", ToastAndroid.SHORT);

      //toast para iPhone
      Toast.show('Livro não encontrado, cheque o ID e tente novamente', {
        duration: Toast.durations.SHORT,
      });


      this.setState({
        bookId: "",
        studentId: "",
      });
    }
  };

  initiateBookIssue = (bookId, studentId, bookName, studentName) => {
    var transactionsRef = collection(db, "transactions");
    var bookRef = doc(db, "books", bookId);
    var studentRef = doc(db, "students", studentId);

    addDoc(transactionsRef, {
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: serverTimestamp(),
      transaction_type: "issue",
    });

    updateDoc(bookRef, {
      is_book_available: false,
    });

    updateDoc(studentRef, {
      number_of_books_issued: increment(1),
    });

    this.setState({
      bookId: "",
      studentId: "",
    });
    
    //toast para android
    //ToastAndroid.show("livro retirado", ToastAndroid.SHORT);

    //toast para iPhone
    Toast.show('Livro retirado', {
      duration: Toast.durations.SHORT,
    });
  };

  InitiateBookReturn = (bookId, studentId, bookName, studentName) => {
    var transactionsRef = collection(db, "transactions");
    var bookRef = doc(db, "books", bookId);
    var studentRef = doc(db, "students", studentId);

    addDoc(transactionsRef, {
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: serverTimestamp(),
      transaction_type: "return",
    });

    updateDoc(bookRef, {
      is_book_available: true,
    });

    updateDoc(studentRef, {
      number_of_books_issued: increment(-1),
    });

    this.setState({
      bookId: "",
      studentId: "",
    });

    //toast para android
    //ToastAndroid.show("livro devolvido", ToastAndroid.SHORT);

    //toast para iPhone
    //toast para iPhone
    Toast.show('Livro não devolvido', {
      duration: Toast.durations.SHORT,
    });
  };

  getBookDetails = (bookId) => {
    bookId = bookId.trim();
    const bookRef = doc(db, "books", bookId);

    getDoc(bookRef)
      .then((doc) => {
        this.setState({
          bookName: doc.data().book_name,
        });
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
      })
      .catch((error) => console.warn(error.message));
  };

  checkBookAvailability = async (bookId) => {
    const bookRef = doc(db, "books", bookId);
    const bookDoc = await getDoc(bookRef);
    let transactionType = "";

    if (bookDoc.data()) {
      let book = bookDoc.data();
      transactionType = book.is_book_available ? "issue" : "return";
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
      <KeyboardAvoidingView behavior="height" style={styles.container}>
      <RootSiblingParent>
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
                onChangeText={text => this.setState({bookId: text})}
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
                onChangeText={text => this.setState({studentId: text})}
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
        </RootSiblingParent>
      </KeyboardAvoidingView>
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
