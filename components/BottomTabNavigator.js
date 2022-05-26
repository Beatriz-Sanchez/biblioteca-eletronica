import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from '../screens/Search';
import TransactionScreen from '../screens/Transaction';
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default class BottomTabNavigator extends Component {
  render(){
    return(
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Transação") {
                iconName = "book";
              } else if (route.name === "Pesquisa") {
                iconName = "search";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "#F48D20",
            tabBarActiveBackgroundColor: "#F48D20",
            tabBarInactiveBackgroundColor: "transparent",
            tabBarLabelStyle: {
              fontFamily: "Rajdhani_600SemiBold",
              fontSize: 20,
            },
            tabBarLabelPosition: "beside-icon",
            tabBarItemStyle: {
              borderRadius: 30,
              justifyContent: "center",
              borderWidth: 2,
              marginVertical: 15,
              marginHorizontal: 10,
              borderColor: "#F48D20",
            },
            tabBarStyle: {
              height: 100,
              borderTopWidth: 0,
              backgroundColor: "#5653d4",
            },
          })}
        >
          <Tab.Screen name="Transação" component={TransactionScreen}/>
          <Tab.Screen name="Pesquisa" component={SearchScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}