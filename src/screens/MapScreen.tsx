import React, { useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { DESTINATION } from '../constants/Coords';
import { LocationObject } from 'expo-location';

interface MapScreenProps {
  location: LocationObject | null;
}

export default function MapScreen({ location }: MapScreenProps) {
  const mapRef = useRef<MapView>(null);

  const handleFitRoute = () => {
    if (location && mapRef.current) {
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      mapRef.current.fitToCoordinates(
        [userCoords, DESTINATION],
        {
          edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  };

  const handleCenterUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  if (!location) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Aguardando GPS...</Text>
      </View>
    );
  }

  const userCoords = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Circle 
          center={userCoords}
          radius={location.coords.accuracy || 0} 
          fillColor="rgba(0, 122, 255, 0.2)" 
          strokeColor="rgba(0, 122, 255, 0.4)" 
          zIndex={1}
        />

        <Marker coordinate={userCoords} title="Você está aqui" zIndex={2}>
          <View style={styles.userMarker}>
            <Ionicons name="person" size={20} color="#007AFF" />
          </View>
        </Marker>

        <Marker 
          coordinate={DESTINATION} 
          title={DESTINATION.title} 
          description={DESTINATION.description}
        >
          <Ionicons name="flag" size={35} color="#FF3B30" />
        </Marker>

        <Polyline
          coordinates={[userCoords, DESTINATION]}
          strokeColor="#000"
          strokeWidth={3}
          lineDashPattern={[5, 5]}
        />
      </MapView>

      <TouchableOpacity 
        style={[styles.fab, { bottom: 90 }]} 
        onPress={handleFitRoute}
        activeOpacity={0.7}
      >
        <Ionicons name="map" size={28} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.fab, { bottom: 20 }]} 
        onPress={handleCenterUser}
        activeOpacity={0.7}
      >
        <Ionicons name="locate" size={30} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: Dimensions.get('window').width, height: '100%' },
  userMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 }
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#eee'
  }
});