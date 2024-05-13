import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import MessageCard from "../components/MessageCard";
import * as Notifications from "expo-notifications";
import { useResource } from "../utils/useResourceByUser";

const MessageScreen = ( { route }) => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const userId = route.params.userId;
  const resource = useResource(userId);

  const messages = [
    {
      sender: "Dr. Smith",
      message: "Your test results are ready.",
      time: "9:30 AM",
    },
    {
      sender: "Nurse Olivia",
      message: "Please remember to take your medication.",
      time: "11:15 AM",
    },
  ];

  const enableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need permission to send you notifications"
      );
      return;
    }

    setIsPermissionGranted(true);
  };

  const handleMessagePress = (message) => {
    Alert.alert(
      message.sender,
      message.message,
      [
        {
          text: "Close",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleLinkPress = (link) => {
    Linking.openURL(link);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {messages.map((message, index) => (
          <MessageCard
            key={index}
            sender={message.sender}
            message={message.message}
            time={message.time}
            onPress={() => handleMessagePress(message)}
          />
        ))}
        {resource.map((item, index) => (
          <MessageCard
            key={`resource-${index}`}
            sender="Resource"
            message={item.text}
            time=""
            link={item.link}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.notificationButton} onPress={enableNotifications}>
        <Text style={styles.notificationButtonText}>Enable Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  notificationButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
  },
  notificationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MessageScreen;
