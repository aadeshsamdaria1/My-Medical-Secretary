import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getUserEndpoint } from '../api';

const HomeScreen = ({ route }) => {
  // Sample data for upcoming appointments and recent messages

  const upcomingAppointments = [
    {
      id: '1',
      date: '2023-04-02',
      time: '10:00 AM',
      provider: {
        name: 'Dr. John Doe',
        specialty: 'General Practitioner',
        avatar: require('../assets/favicon.png'),
      },
    },
    {
      id: '2',
      date: '2023-04-10',
      time: '2:30 PM',
      provider: {
        name: 'Dr. Jane Smith',
        specialty: 'Pediatrician',
        avatar: require('../assets/favicon.png'),
      },
    },
  ];
  const recentMessages = [
    { id: '1', sender: 'Nurse Mary', message: 'Please remember to take your medication. This is a longer message to demonstrate the functionality.' },
    { id: '2', sender: 'Dr. John Doe', message: 'Your test results are ready.' },
  ];

  // GET requests to fetch data from backend
  // const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  // const [recentMessages, setRecentMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const [showMoreAppointments, setShowMoreAppointments] = useState(false);
  const [showMoreMessages, setShowMoreMessages] = useState(false);


  // const fetchUpcomingAppointments = async () => {
  //   try {
  //     const response = await fetch('/api/appointments');
  //     const data = await response.json();
  //     setUpcomingAppointments(data);
  //   } catch (error) {
  //     console.error('Error fetching upcoming appointments:', error);
  //   }
  // };

  // const fetchRecentMessages = async () => {
  //   try {
  //     const response = await fetch('/api/messages');
  //     const data = await response.json();
  //     setRecentMessages(data);
  //   } catch (error) {
  //     console.error('Error fetching recent messages:', error);
  //   }
  // };

  useEffect(() => {
    fetchUserName();
  //   fetchUpcomingAppointments();
  //   fetchRecentMessages();
  }, []);

  const fetchUserName = async () => {
    try {
      const userId = route.params?.userId; // Retrieve the user ID from the navigation prop, or use a default value
      const response = await fetch(getUserEndpoint(userId));
      const data = await response.json();
      setUserName(data.firstname + ' ' + data.middleName + ' ' + data.surname);
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const handleMessagePress = (message) => {
    Alert.alert(
      'Message',
      message,
      [
        {
          text: 'Close',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi, {userName}</Text>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.length > 0 ? (
            <FlatList
              data={showMoreAppointments ? upcomingAppointments : upcomingAppointments.slice(0, 2)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.appointmentItem, { backgroundColor: 'lightblue' }]}>
                  <View style={styles.appointmentHeader}>
                    <Image source={item.provider.avatar} style={styles.appointmentAvatar} />
                    <View style={styles.appointmentProviderInfo}>
                      <Text style={styles.appointmentProviderName}>{item.provider.name}</Text>
                      <Text style={styles.appointmentProviderSpecialty}>{item.provider.specialty}</Text>
                    </View>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentDate}>{formatAppointmentDate(item.date)}</Text>
                    <Text style={styles.appointmentTime}>{item.time}</Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noDataText}>No upcoming appointments</Text>
          )}
          {upcomingAppointments.length > 2 && (
            <View style={styles.showMoreButtonContainer}>
              {showMoreAppointments ? (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreAppointments(false)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show Less</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreAppointments(true)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show More</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          {recentMessages.length > 0 ? (
            <FlatList
              data={showMoreMessages ? recentMessages : recentMessages.slice(0, 2)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.messageItem, { backgroundColor: '#f5f5f5' }]}
                  onPress={() => handleMessagePress(item.message)}
                >
                  <Text style={styles.messageSender}>{item.sender}</Text>
                  <Text style={styles.messageText}>{item.message.length > 50 ? `${item.message.slice(0, 50)}...` : item.message}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noDataText}>No recent messages</Text>
          )}
          {recentMessages.length > 2 && (
            <View style={styles.showMoreButtonContainer}>
              {showMoreMessages ? (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreMessages(false)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show Less</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setShowMoreMessages(true)}
                >
                  <Text style={[styles.showMoreText, { color: 'white' }]}>Show More</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  dashboard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  appointmentItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  appointmentProviderInfo: {
    flex: 1,
  },
  appointmentProviderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentProviderSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
  },
  messageItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
  showMoreButtonContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  showMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  showMoreText: {
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 24,
  },
});

export default HomeScreen;
