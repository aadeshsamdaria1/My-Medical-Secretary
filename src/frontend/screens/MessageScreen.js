import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import MessageCard from "../components/MessageCard";
import * as Notifications from "expo-notifications";
import { useResource } from "../utils/useResourceByUser";
import { useMessage } from "../utils/useMessageByUser";
import ResourcesCard from "../components/ResourcesCard";

const MessageScreen = ({ route }) => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const userId = route.params.userId;
  const resource = useResource(userId);
  const message = useMessage(userId);

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

  return (
    <View style={styles.container}>
    <ScrollView>
      <Text style={styles.header}>All Messages</Text>
      {message.length > 0 ? (
        message.map((msg, index) => (
          <MessageCard
            key={index}
            message={msg.text}
            timeCreated={msg.timeCreated}
          />
        ))
      ) : (
        <Text style={styles.noDataText}>No messages have been shared with you yet.</Text>
      )}
      <Text style={styles.header}>Links to Additional Resources</Text>
      {resource.length > 0 ? (
        <ResourcesCard resources={resource} />
      ) : (
        <Text style={styles.noDataText}>No resources have been shared with you yet.</Text>
      )}
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
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 16,
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
  noDataText: {
    margin: 10,
    marginLeft: 20,
    fontSize: 17,
    color: "grey"

  }
});

export default MessageScreen;
