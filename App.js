import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import homesData from './data/homes.json';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HomeList = ({ navigation }) => {
  const [homes, setHomes] = useState([]);

  useEffect(() => {
    setHomes(homesData);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('HomeDetails', { home: item })}>
      <View style={styles.homeItem}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View>
          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={homes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const HomeDetails = ({ route }) => {
  const { home } = route.params;
  const [location, setLocation] = useState(null);
  const [canUnlock, setCanUnlock] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Check if the user is within 30m of the home
      const distance = getDistance(location.coords.latitude, location.coords.longitude, home.latitude, home.longitude);
      if (distance <= 30) {
        setCanUnlock(true);
        // Trigger a notification when the user is within 30 meters
        Notifications.scheduleNotificationAsync({
          content: {
            title: "User Vicinity Alert",
            body: `User is within 30 meters of ${home.address}.`,
          },
          trigger: null,
        });
      }
    })();
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // Distance in meters
    return d;
  };

  const handleUnlock = () => {
    setTimeout(() => {
      Alert.alert('Success', 'Home unlocked successfully!');
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Home Unlocked",
          body: `You have successfully unlocked ${home.address}.`,
        },
        trigger: null,
      });
    }, 1000);
  };

  return (
    <View style={styles.detailsContainer}>
      <Image source={{ uri: home.image }} style={styles.detailsImage} />
      <Text style={styles.detailsAddress}>{home.address}</Text>
      <Text style={styles.detailsDescription}>{home.description}</Text>
      {canUnlock && <Button title="Unlock Home" onPress={handleUnlock} />}
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeList">
        <Stack.Screen name="HomeList" component={HomeList} options={{ title: 'Homes List' }} />
        <Stack.Screen name="HomeDetails" component={HomeDetails} options={{ title: 'Home Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  address: {
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
  },
  detailsContainer: {
    padding: 20,
  },
  detailsImage: {
    width: '100%',
    height: 200,
  },
  detailsAddress: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#555',
  },
});
