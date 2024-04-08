import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageCard = ({ sender, message, time }) => {
  return (
    <View style={styles.messageCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.senderText}>{sender}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    opacity: 0.6,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
});

export default MessageCard;
