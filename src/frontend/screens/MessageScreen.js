import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import MessageCard from "../components/MessageCard";
import * as Notifications from "expo-notifications";
import { useResource } from "../utils/useResourceByUser";
import { useMessage } from "../utils/useMessageByUser";

const MessageScreen = ({ route }) => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const userId = route.params.userId;
  const resource = useResource(userId);
  const message = useMessage(userId);

  // const message = [
  //   {
  //     patientId: 999999999,
  //     text: "Your test results are ready.",
  //   },
  //   {
  //     patientId: 999999999,
  //     text: "For many of you, these subjects represent an important moment — the transition from theoretical knowledge to practical application, from student to industry innovator. This is your arena to apply agile methodologies, collaborate effectively, and engage with industry clients, perhaps for the first time. We understand the challenges ahead and have designed these notes to smooth your path to becoming a confident software engineer.",
  //   },
  // ];

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setIsPermissionGranted(status === "granted");
    };

    checkNotificationPermission();
  }, []);

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
    // Handle message press event
  };

  const handleLinkPress = (link) => {
    Linking.openURL(link);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {message.map((message, index) => (
          <MessageCard
            key={index}
            message={message.text}
          />
        ))}
        {resource.map((item, index) => (
          <MessageCard
            key={`resource-${index}`}
            message={item.text}
            link={item.link}
          />
        ))}
      </ScrollView>
      {!isPermissionGranted && (
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={enableNotifications}
        >
          <Text style={styles.notificationButtonText}>Enable Notifications</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 16,
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