import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { LocationObject, LocationGeocodedAddress } from 'expo-location';

interface InfoScreenProps {
  location: LocationObject | null;
  address: LocationGeocodedAddress[] | null;
  distance: number;
}

export default function InfoScreen({ location, address, distance }: InfoScreenProps) {
  
 
  const getFormattedAddress = () => {
    if (!address || address.length === 0) return 'Carregando endereço...';
    
    const addr = address[0];
    
    
    const streetInfo = addr.street || addr.name || addr.district || 'Logradouro não identificado';
    
    
    return `${streetInfo} - ${addr.city || ''}/${addr.region || ''}`; // Ex: Rua X - Varginha/MG
  };

  if (!location) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Aguardando GPS...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.infoContainer}>
      <Text style={styles.headerTitle}>Painel de Dados</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Coordenadas:</Text>
        <Text style={styles.value}>Lat: {location.coords.latitude}</Text>
        <Text style={styles.value}>Lon: {location.coords.longitude}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Altitude:</Text>
        <Text style={styles.value}>
          {location.coords.altitude ? `${location.coords.altitude.toFixed(2)} m` : 'N/A'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Precisão:</Text>
        <Text style={styles.value}>+/- {location.coords.accuracy?.toFixed(1)} m</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>
          {getFormattedAddress()}
        </Text>
      </View>

      <View style={[styles.card, styles.highlightCard]}>
        <Text style={styles.labelHighlight}>Distância:</Text>
        <Text style={styles.valueHighlight}>
          {(distance / 1000).toFixed(2)} km
        </Text>
        <Text style={styles.subText}>(Linha Reta / Haversine)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: 
  { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
},
  infoContainer: 
  { 
    padding: 20 
},
  headerTitle: 
  { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#333' 
},
  card: 
  { 
    backgroundColor: '#f9f9f9', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#eee' 
},
  highlightCard: 
  { 
    backgroundColor: '#e6f7ff', 
    borderColor: '#1890ff' 
},
  label: 
  { 
    fontWeight: 'bold', 
    color: '#555' 
},
  value: 
  { 
    fontSize: 16, 
    color: '#000', 
    marginTop: 2 
},
  labelHighlight: 
  { 
    fontWeight: 'bold', 
    color: '#0050b3', 
    fontSize: 16 
},
  valueHighlight: 
  { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#0050b3' 
},
  subText: 
  { 
    fontSize: 12, 
    color: '#666', 
    fontStyle: 'italic' }
});