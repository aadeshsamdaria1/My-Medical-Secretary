import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageCard = ({ sender, message, time }) => {
  return (
    <View style={styles.messageCard}>
      <View style={styles.cardHeader}>
        <View style={styles.senderContainer}>
          <Text style={styles.senderText}>{sender}</Text>
        </View>
        <View style={styles.senderContainer}>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
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
    marginBottom: 8,
  },
  senderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  senderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  timeText: {
    fontSize: 15,
    color: "#666",
    opacity: 0.8,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
});

export default MessageCard;
