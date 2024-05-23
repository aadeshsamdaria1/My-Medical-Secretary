import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { login } from '../api';
import { activateAccountByEmail, sendOneTimeCode } from '../utils/resetPasswordAPI';
import { registerDeviceToken } from '../utils/NotificationService';


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
    if (username === "" || password === "") {
      return;
    }

    try {
      const [token, userId] = await login(username, password);
      // TODO send expo token here
      registerDeviceToken(userId);
      navigation.navigate('TabNavigator', { token, userId });
    } catch (error) {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  const handleForgotPasswordSubmit = async () => {
    if (forgotPasswordEmail === "") {
      return;
    }
    try {
      const response = await activateAccountByEmail(forgotPasswordEmail);
      setPasscode("");
      setNewPassword("");
      setConfirmPassword("");
      setForgotPasswordModal(false);
      setResetPasswordModal(true);
      
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data) {
        console.error(error.response.data);
        Alert.alert('Error', error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    if (passcode === "") {
      Alert.alert('Error', 'Please enter 6-digit Passcode');
      return;
    }
  
    if (newPassword === "") {
      Alert.alert('Error', 'Password cannot be empty');
      return;
    }
    
    try {
      const response = await sendOneTimeCode(forgotPasswordEmail, passcode, newPassword);
      setUsername(response)
      setPassword(newPassword)
      setResetPasswordModal(false);
      Alert.alert('Successfully set password for user' + username, );
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401 && error.response.data) {
        Alert.alert('Error', error.response.data);
        setPasscode("");
      } else {
        Alert.alert('Error', 'An error occurred while resetting the password');
      }
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
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
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
        <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={40}>
        <View style={styles.forgotPasswordModal}>
          <View style={styles.forgotPasswordContent}>
            <Text style={styles.forgotPasswordTitle}>Enter your Email</Text>
            <TextInput
              style={styles.forgotPasswordInput}
              placeholder="Email"
              value={forgotPasswordEmail}
              onChangeText={setForgotPasswordEmail}
              autoCapitalize="none"
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
        </KeyboardAvoidingView>
      </Modal>
      
      <Modal visible={resetPasswordModal} animationType="slide" transparent>
        <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={40}>
        <View style={styles.forgotPasswordModal}>
          <View style={styles.forgotPasswordContent}>
            <Text 
                style={styles.emailResponseText}>
                A verification code has been sent to your email. If you cannot find it, please check your spam folder.</Text>
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
              autoCapitalize="none"
            />
            <Text style={styles.forgotPasswordTitle}>Confirm Password</Text>
            <TextInput
              style={styles.forgotPasswordInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
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
        </KeyboardAvoidingView>
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
  emailResponseText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#007AFF"
  }
});

export default LoginScreen;