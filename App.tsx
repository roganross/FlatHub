import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ✅ Ensures swipe gestures work
import { auth } from "./src/services/firebaseConfig"; // ✅ Import Firebase config
import Header from "./src/components/Header"; // ✅ Import universal header

// Screen imports
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import EventScreen from "./src/screens/EventScreen";
import TodoScreen from "./src/screens/TodoScreen";
import NotesScreen from "./src/screens/NotesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

import { RootStackParamList, MainTabParamList } from "./src/types";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      id={"MainTabs" as unknown as undefined}
      screenOptions={{
        header: () => <Header />, // ✅ Universal header applied to all screens
      }}
    >
      <Tab.Screen name="Events" component={EventScreen} />
      <Tab.Screen name="Todo" component={TodoScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // ✅ Firebase listener to check authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ✅ Fix for swipe gestures */}
      <NavigationContainer>
        <Stack.Navigator 
        id={"RootStack" as unknown as undefined}
        screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            </>
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
