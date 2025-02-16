import React from 'react';
import { Button, View, Text } from "react-native";
import { logout } from "../services/authService";

const SettingsScreen = () => {
  return (
    <View>
      <Text>Settings Screen</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default SettingsScreen; // Make sure this line exists
