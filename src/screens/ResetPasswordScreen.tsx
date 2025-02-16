import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity } from 'react-native';
import { sendPasswordReset } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();

  const handleReset = async () => {
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      Alert.alert(
        "Email Sent",
        "Check your inbox for password reset instructions.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      setEmail('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to send reset email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <Button
        title="Send Reset Email"
        onPress={handleReset}
        disabled={isLoading || !email.trim()}
      />

    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
    <Text style={{ color: 'blue' }}>Login</Text>
    </TouchableOpacity>

    <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={{ marginTop: 15, alignSelf: 'center' }}
    >
        <Text style={{ color: 'blue' }}>Don't have an account?</Text>
    </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;