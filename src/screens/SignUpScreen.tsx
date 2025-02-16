import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { signUp } from '../services/authService'; 
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
      <Text style={{ color: 'blue' }}>Login</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
      <Text style={{ color: 'blue' }}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
