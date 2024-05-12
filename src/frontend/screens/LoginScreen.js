import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { API_ENDPOINT, login } from '../api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const [token, userId] = await login(username, password);
      navigation.navigate('TabNavigator', { token, userId });
    } catch (error) {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      // Send a request to the server to generate a 6-digit passcode and send it to the user's email
      // ...
      setForgotPasswordModal(false);
      setResetPasswordModal(true);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while resetting the password');
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    try {
      // Send a request to the server to verify the passcode and update the password
      // ...
      setResetPasswordModal(false);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while resetting the password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={40}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setForgotPasswordModal(true)}
          style={styles.forgotPasswordLink}
        >
          <Text style={styles.forgotPasswordLinkText}>Forgot Password? / Register</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={forgotPasswordModal} animationType="slide" transparent>
        <View style={styles.forgotPasswordModal}>
          <View style={styles.forgotPasswordContent}>
            <Text style={styles.forgotPasswordTitle}>Enter your Email</Text>
            <TextInput
              style={styles.forgotPasswordInput}
              placeholder="Username"
              value={forgotPasswordEmail}
              onChangeText={setForgotPasswordEmail}
            />
            <View style={styles.forgotPasswordButtonContainer}>
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPasswordSubmit}
              >
                <Text style={styles.forgotPasswordButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => setForgotPasswordModal(false)}
              >
                <Text style={styles.forgotPasswordButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={resetPasswordModal} animationType="slide" transparent>
        <View style={styles.forgotPasswordModal}>
          <View style={styles.forgotPasswordContent}>
            <Text style={styles.forgotPasswordTitle}>Enter 6-digit Passcode</Text>
            <TextInput
              style={styles.forgotPasswordInput}
              placeholder="6-digit Passcode"
              value={passcode}
              onChangeText={setPasscode}
              keyboardType="number-pad"
            />
            <Text style={styles.forgotPasswordTitle}>Enter New Password</Text>
            <TextInput
              style={styles.forgotPasswordInput}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Text style={styles.forgotPasswordTitle}>Confirm Password</Text>
            <TextInput
              style={styles.forgotPasswordInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <View style={styles.forgotPasswordButtonContainer}>
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleResetPasswordSubmit}
              >
                <Text style={styles.forgotPasswordButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => setResetPasswordModal(false)}
              >
                <Text style={styles.forgotPasswordButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPasswordModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  forgotPasswordContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  forgotPasswordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  forgotPasswordInput: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  forgotPasswordButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgotPasswordButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  forgotPasswordButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPasswordLink: {
    marginTop: 16,
  },
  forgotPasswordLinkText: {
    color: '#007AFF',
  },
  forgotPasswordModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  forgotPasswordContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  forgotPasswordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  forgotPasswordInput: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  forgotPasswordButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgotPasswordButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  forgotPasswordButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;