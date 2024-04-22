import { Alert } from "react-native";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../screens/LoginScreen";
jest.spyOn(Alert, "alert");

// Login Screen tests
describe("LoginScreen", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Check if the username input field is rendered
    const usernameInput = getByPlaceholderText("Username");
    expect(usernameInput).toBeTruthy();

    // Check if the password input field is rendered
    const passwordInput = getByPlaceholderText("Password");
    expect(passwordInput).toBeTruthy();

    // Check if the "Sign In" button is rendered
    const signInButton = getByText("Sign In");
    expect(signInButton).toBeTruthy();
  });

  it("signs in with valid credentials", async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );

    // Fill in the username and password fields
    const usernameInput = getByPlaceholderText("Username");
    fireEvent.changeText(usernameInput, "admin");

    const passwordInput = getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "password");

    // Press the "Sign In" button
    const signInButton = getByText("Sign In");
    fireEvent.press(signInButton);

    // Check if the navigation function was called with the correct screen and parameters
    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith("TabNavigator", {
        token: expect.any(String), 
        userId: 1, 
      });
    });
  });

  it("shows an error message with invalid username", async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );

    // Fill in the username field with an invalid username
    const usernameInput = getByPlaceholderText("Username");
    fireEvent.changeText(usernameInput, "invalidUsername");

    // Fill in the password field with a valid password
    const passwordInput = getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "password");

    // Press the "Sign In" button
    const signInButton = getByText("Sign In");
    fireEvent.press(signInButton);

    // Check if the error alert was shown
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Invalid username or password"
      );
    });
  });

  it("shows an error message with invalid password", async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );

    // Fill in the username field with a valid username
    const usernameInput = getByPlaceholderText("Username");
    fireEvent.changeText(usernameInput, "admin");

    // Fill in the password field with an invalid password
    const passwordInput = getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "wrongPassword");

    // Press the "Sign In" button
    const signInButton = getByText("Sign In");
    fireEvent.press(signInButton);

    // Check if the error alert was shown
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Invalid username or password"
      );
    });
  });

  it("shows an error message with invalid credentials", async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );

    // Fill in the username and password fields with invalid credentials
    const usernameInput = getByPlaceholderText("Username");
    fireEvent.changeText(usernameInput, "invalid");

    const passwordInput = getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "wrong");

    // Press the "Sign In" button
    const signInButton = getByText("Sign In");
    fireEvent.press(signInButton);

    // Check if the error alert was shown
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Invalid username or password"
      );
    });
  });
});
