import { Alert, Linking } from "react-native";


export const handleLinkPress = async (link) => {
    const formattedLink = link.startsWith("http") ? link : `https://${link}`;
    
    Alert.alert(
      "Open Link",
      "Do you wish to open this link?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await Linking.openURL(formattedLink);
            } catch (error) {
              Alert.alert(
                "Error",
                "Unable to open the link. Please check if you have a compatible app installed."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  export const handleEmailPress = async (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email Address", "Please enter a valid email address.");
      return;
    }
  
    const mailtoLink = `mailto:${email}`;
  
    try {
      const supported = await Linking.canOpenURL(mailtoLink);
      if (!supported) {
        Alert.alert(
          "Error",
          "Unable to open the email client. Please check if you have an email app installed."
        );
      } else {
        await Linking.openURL(mailtoLink);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to open the email client. Please check if you have an email app installed."
      );
    }
  };

  export const handleCallPress = async (phoneNumber) => {
    const lastChar = phoneNumber.charAt(phoneNumber.length - 1);
  
    if (isNaN(lastChar)) {
      // checking if last digit is a number -> naive way to ensure contact field is a number
      return;
    }
  
    const formattedPhoneNumber = `tel:${phoneNumber}`;
  
    try {
      const supported = await Linking.canOpenURL(formattedPhoneNumber);
      if (!supported) {
        Alert.alert(
          "Error",
          "Unable to make the call. Please check if you have a phone app installed."
        );
      } else {
        await Linking.openURL(formattedPhoneNumber);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to make the call. Please check if you have a phone app installed."
      );
    }
  };