import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

const MessageCard = ({ message, link, timeCreated, onPress }) => {

  const formattedTime = new Date(timeCreated).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }

    const alertButtons = [
      {
        text: "Close",
        style: "cancel",
      },
    ];

    Alert.alert(formattedTime, message, alertButtons, {
      cancelable: true,
    });
  };

  return (
    <TouchableOpacity style={styles.messageCard} onPress={handleCardPress}>
      <Text style={styles.timeText}>{formattedTime}</Text>
      <View style={styles.messageHeader}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageCard: {
    backgroundColor: "#007AFF22",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,

  },
  timeText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
});

export default MessageCard;
