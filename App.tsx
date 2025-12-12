import 'react-native-gesture-handler'; 
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import MapScreen from './src/screens/MapScreen';
import InfoScreen from './src/screens/InfoScreen';
import { DESTINATION } from './src/constants/Coords';
import { getHaversineDistance } from './src/utils/MathUtils';


const Drawer = createDrawerNavigator();

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<Location.LocationGeocodedAddress[] | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada');
          setLoading(false);
          return;
        }

        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 1 },
          (newLocation) => {
            setLocation(newLocation);
            const dist = getHaversineDistance(
              newLocation.coords.latitude,
              newLocation.coords.longitude,
              DESTINATION.latitude,
              DESTINATION.longitude
            );
            setDistance(dist);
            setLoading(false);
          }
        );

        let loc = await Location.getCurrentPositionAsync({});
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });
        setAddress(reverseGeocode);

      } catch (error) {
        setErrorMsg('Erro ao obter localização');
        setLoading(false);
      }
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Iniciando App...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Mapa"
        screenOptions={{
          drawerActiveTintColor: 'tomato', 
          drawerInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          },
          headerTitleAlign: 'center', 
          headerTintColor: '#333', 
        }}
      >
      
        <Drawer.Screen 
          name="Mapa"
          options={{
            headerTitle: "Tela do Mapa", 
            drawerIcon: ({ color, size }) => (
              <Ionicons name="map-outline" size={size} color={color} />
            ),
          }}
        >
          
          {() => <MapScreen location={location} />}
        </Drawer.Screen>
        
     
        <Drawer.Screen 
          name="Informações"
          options={{
            headerTitle: "Painel de Dados",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
            ),
          }}
        >
          {() => <InfoScreen location={location} address={address} distance={distance} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}