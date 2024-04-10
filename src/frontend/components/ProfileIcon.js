import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileIcon = () => {
  return (
    <TouchableOpacity style={styles.userProfile}>
      <Ionicons name="person-circle" size={40} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userProfile: {
    paddingRight: 20,
  },
});

export default ProfileIcon;