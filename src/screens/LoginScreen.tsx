import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { login } from '../services/authService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [isLoading, setIsLoading] = useState(false);
  const isFormValid = email.trim() && password.trim();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
      navigation.navigate('Main');
    } catch (error) {
      // ... error handling
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 }}
      />
      
      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <Button 
        title="Log In" 
        onPress={handleLogin} 
        disabled={!isFormValid || isLoading} 
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={{ marginTop: 15, alignSelf: 'center' }}
      >
        <Text style={{ color: 'blue' }}>Don't have an account?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
      <Text style={{ color: 'blue' }}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;