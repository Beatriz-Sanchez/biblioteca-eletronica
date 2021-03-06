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
  query,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
//toast p/ iPhone e Android
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

import { db } from "../config";

//para evitar avisos de timer
LogBox.ignoreLogs(["Setting a timer"]);

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

    await this.getBookDetails(bookId);
    await this.getStudentDetails(studentId);
    const { bookName, studentName } = this.state;

    var transactionType = await this.checkBookAvailability(bookId);

    if (transactionType == "issue") {
      var isEligible = await this.checkStudentEligibilityForBookIssue(
        studentId
      );
      if (isEligible) {
        this.initiateBookIssue(bookId, studentId, bookName, studentName);
      }
    } else if (transactionType == "return") {
      var isEligible = await this.checkStudentEligibilityForBookReturn(
        bookId,
        studentId
      );
      if (isEligible) {
        this.initiateBookReturn(bookId, studentId, bookName, studentName);
      }
    } else if (!transactionType) {
      //toast para Android
      //ToastAndroid.show("Livro n??o encontrado, cheque o ID e tente novamente", ToastAndroid.LONG);

      //toast para iPhone
      Toast.show("Livro n??o encontrado, cheque o ID e tente novamente", {
        duration: Toast.durations.LONG,
      });

      this.setState({
        bookId: "",
        studentId: "",
        bookName: "",
        studentName: "",
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
    Toast.show("Livro retirado", {
      duration: Toast.durations.SHORT,
    });
  };

  initiateBookReturn = (bookId, studentId, bookName, studentName) => {
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
    Toast.show("Livro devolvido", {
      duration: Toast.durations.SHORT,
    });
  };

  getBookDetails = async (bookId) => {
    bookId = bookId.trim();
    const bookRef = doc(db, "books", bookId);
    const bookDoc = await getDoc(bookRef);

    try {
      this.setState({
        bookName: bookDoc.data().book_name,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  getStudentDetails = async (studentId) => {
    studentId = studentId.trim();
    const studentRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(studentRef)

    try {
      this.setState({
        studentName: studentDoc.data().student_name,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  checkBookAvailability = async (bookId) => {
    const bookRef = doc(db, "books", bookId);
    const bookDoc = await getDoc(bookRef);
    let transactionType = "";

    if (bookDoc.exists()) {
      let book = bookDoc.data();
      transactionType = book.is_book_available ? "issue" : "return";
    } else {
      transactionType = false;
    }

    return transactionType;
  };

  checkStudentEligibilityForBookIssue = async (studentId) => {
    var studentRef = doc(db, "students", studentId);
    var studentDoc = await getDoc(studentRef);

    var isStudentEligible = "";

    if (studentDoc.exists()) {
      if (studentDoc.data().number_of_books_issued < 2) {
        isStudentEligible = true;
      } else {
        isStudentEligible = false;
        //ToastAndroid.show("O aluno j?? atingiu o limite de 2 livros", ToastAndroid.LONG);
        Toast.show("O aluno j?? atingiu o limite de 2 livros", {
          duration: Toast.durations.LONG,
        });
        this.setState({
          bookId: "",
          studentId: "",
        });
      }
    } else {
      this.setState({ bookId: "", student: "" });
      isStudentEligible = false;
      //ToastAndroid.show("O ID do aluno n??o existe no banco de dados", ToastAndroid.LONG);
      Toast.show("O ID do aluno n??o existe no banco de dados", {
        duration: Toast.durations.LONG,
      });
    }

    return isStudentEligible;
  };

  checkStudentEligibilityForBookReturn = async (bookId, studentId) => {
    const transactionRef = query(
      collection(db, "transactions"),
      where("book_id", "==", bookId),
      orderBy("date", "desc"),
      limit(1)
    );
    const docs = await getDocs(transactionRef);

    var isStudentEligible;
    docs.forEach((doc) => {
      var lastBookTransaction = doc.data();

      if (lastBookTransaction.student_id === studentId) {
        isStudentEligible = true;
      } else {
        isStudentEligible = false;
        //ToastAndroid.show("O livro n??o foi retirado por este aluno", ToastAndroid.SHORT);
        Toast.show("O livro n??o foi retirado por este aluno", {
          duration: Toast.durations.SHORT,
        });
      }
    });

    return isStudentEligible;
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
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={-500}
        style={styles.container}
      >
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
                  onChangeText={(text) => this.setState({ bookId: text })}
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
                  onChangeText={(text) => this.setState({ studentId: text })}
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
    justifyContent: "space-between",
  },
  textInput: {
    minWidth: "57%",
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
