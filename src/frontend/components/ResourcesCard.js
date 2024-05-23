// ResourcesCard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

const ResourcesCard = ({ resources }) => {
  const handleLinkPress = async (link) => {
    const formattedLink = link.startsWith("http") ? link : `https://${link}`;
    try {
      await Linking.openURL(formattedLink);
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to open the link. Please check if you have a compatible app installed."
      );
    }
  };

  return (
    <View>
      {resources.map((resource, index) => (
        <TouchableOpacity
          key={index}
          style={styles.resourceCard}
          onPress={() => handleLinkPress(resource.link)}
        >
          <Text style={styles.resourceTitle}>{resource.text}</Text>
          {resource.link && (
            <Text style={styles.resourceLink}>{resource.link}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  resourceCard: {
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
  resourceTitle: {
    fontSize: 16,
    color: "#222",
    flexShrink: 1,
  },
  resourceLink: {
    fontSize: 16,
    color: "#007Aff",
    marginTop: 4,
  },
});

export default ResourcesCard;
