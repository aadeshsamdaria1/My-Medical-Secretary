import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { registerDeviceTokenEndpoint } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const registerDeviceToken = async (userId) => {
  try {
      const expoPushToken =  await AsyncStorage.getItem("expoPushToken");
      if (expoPushToken) {
        console.log("registering token")
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        await fetch(registerDeviceTokenEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': "application/json"
          },
  
          body: JSON.stringify({ patientId: userId, deviceToken: expoPushToken })
        });
      } else {
        console.log("no token")
      }

  } catch (error) {
      console.error('Error registering device token', error);
      throw error;
  }
};


function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }
  
export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        //console.log(Constants.easConfig);
        handleRegistrationError('Project ID not found');
      }
      try {
      const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        AsyncStorage.setItem("expoPushToken", pushTokenString);
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }
  