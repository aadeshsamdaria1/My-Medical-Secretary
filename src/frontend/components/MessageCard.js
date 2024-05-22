import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

const MAX_MESSAGE_LENGTH = 100;

const MessageCard = ({ message, link, onPress }) => {
  const truncatedMessage =
    message.length > MAX_MESSAGE_LENGTH
      ? `${message.slice(0, MAX_MESSAGE_LENGTH)}...`
      : message;

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }

    const formattedLink =
      link && link.startsWith("http") ? link : `https://${link}`;

    const alertButtons = [
      {
        text: "Close",
        style: "cancel",
      },
    ];

    if (link) {
      alertButtons.push({
        text: "Open Link",
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
      });
    }

    Alert.alert(null, link ? `${message}\n` : message, alertButtons, {
      cancelable: true,
    });
  };

  return (
    <TouchableOpacity style={styles.messageCard} onPress={handleCardPress}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageText}>{truncatedMessage}</Text>
      </View>
      {link && <Text style={styles.linkText}>{link}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  linkText: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default MessageCard;
