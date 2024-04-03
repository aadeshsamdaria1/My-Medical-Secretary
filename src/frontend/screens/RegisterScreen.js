import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    // Validate the input fields
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      phoneNumber.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === '' ||
      email.trim() === ''
    ) {
      alert('Please fill in all the required fields.');
      return;
    }

    // Validate phone number
    const phoneRegex = /^\+?\d{1,3}?[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid phone number.');
      return;
    }

    // Validate email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Perform registration logic here
    // You can save the user data to your backend or local storage
    console.log('Registered user:', {
      firstName,
      lastName,
      phoneNumber,
      password,
      gender,
      email,
    });
    // Navigate back to the login screen
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
    <View style={styles.contentContainer}>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name *"
          value={firstName}
          onChangeText={setFirstName}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name *"
          value={lastName}
          onChangeText={setLastName}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Password *"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          required
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;