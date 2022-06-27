import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { db } from "../config";

import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";

import { Avatar, ListItem, Icon } from "react-native-elements";

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      searchText: "",
    };
  }
  getTransactions = async () => {
    var transactionsRef = collection(db, "transactions");
    getDocs(transactionsRef).then((docs) =>
      docs.forEach((transaction) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, transaction.data()],
        });
      })
    );
  };
  renderItem = ({ item, i }) => {
    var date = item.date.toDate().toString().split(" ").splice(0, 4).join(" ");

    var transactionType =
      item.transaction_type === "issue" ? "retirado" : "devolvido";
    return (
      <View style={{ borderWidth: 1 }}>
        <ListItem key={i} bottomDivider>
          <Icon type={"antdesign"} name={"book"} size={40} />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              {`${item.book_name} ( ${item.book_id} )`}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {`Este livro foi ${transactionType} por ${item.student_name}`}
            </ListItem.Subtitle>
            <View style={styles.lowerLeftContainer}>
              <View style={styles.transactionContainer}>
                <Text
                  style={[
                    styles.transactionText,
                    {
                      color:
                        item.transaction_type === "issue"
                          ? "#78D304"
                          : "#0364F4",
                    },
                  ]}
                >
                  <Icon
                    type={"ionicon"}
                    name={
                      item.transaction_type === "issue"
                        ? "checkmark-circle-outline"
                        : "arrow-redo-circle-outline"
                    }
                    color={
                      item.transaction_type === "issue" ? "#78D304" : "#0364F4"
                    }
                  />
                  {item.transaction_type.charAt(0).toUpperCase() +
                    item.transaction_type.slice(1)}
                </Text>
              </View>
              <Text style={styles.date}>{date}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  componentDidMount() {
    this.getTransactions();
  }

  handleSearch = async (text) => {
    var enteredText = text.toUpperCase().split("");
    text = text.toUpperCase();

    this.setState({
      allTransactions: [],
    });
    if (!text) {
      this.getTransactions();
    }

    if (enteredText[0] == "B") {
      var searchRef = query(
        collection(db, "transactions"),
        where("book_id", "==", text),
        orderBy("date", "desc")
      );

      try {
        var searchDocs = await getDocs(searchRef);

        searchDocs.forEach((doc) => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
          });
        });
      } catch (error) {
        console.error(error.message);
      }
    } else if (enteredText[0] == "S") {
      var searchRef = query(
        collection(db, "transactions"),
        where("student_id", "==", text),
        orderBy("date", "desc")
      );
      try {
        var searchDocs = await getDocs(searchRef);

        searchDocs.forEach((doc) => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
          });
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  render() {
    const { allTransactions, searchText } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => this.setState({ searchText: text })}
              placeholder={"escreva aqui"}
              placeholderTextColor={"#ffffff"}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.handleSearch(searchText)}
            >
              <Text style={styles.buttonText}>Pesquisa</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lowerContainer}>
          <FlatList
            data={allTransactions}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#5653d4",
  },
  upperContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 70,
  },
  textinputContainer: {
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: "row",
    borderColor: "#FFFFFF",
    marginTop: 10,
    justifyContent: "space-between",
  },
  textinput: {
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
  buttonText: {
    fontSize: 18,
    fontFamily: "Rajdhani_600SemiBold",
    color: "#ffffff",
  },
  lowerContainer: {
    flex: 0.8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontFamily: "Rajdhani_600SemiBold",
    width: "75%",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Rajdhani_600SemiBold",
    width: "75%",
  },
  lowerLeftContainer: {
    alignSelf: "flex-end",
    marginTop: -40,
  },
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 20,

    fontFamily: "Rajdhani_600SemiBold",
  },
  date: {
    fontSize: 12,
    fontFamily: "Rajdhani_600SemiBold",
    paddingTop: 5,
  },
});
