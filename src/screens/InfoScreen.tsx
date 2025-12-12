import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LocationGeocodedAddress } from 'expo-location';
import { DESTINATION } from '../constants/Coords'; // Importamos as coordenadas do destino

interface InfoScreenProps {
  address: LocationGeocodedAddress[] | null;
  distance: number;
}

export default function InfoScreen({ address, distance }: InfoScreenProps) {
  
  const getFormattedAddress = () => {
    if (!address || address.length === 0) return 'Buscando endereço do destino...';
    const addr = address[0];
    const streetInfo = addr.street || addr.name || addr.district || 'Logradouro não identificado';
    // Adicionei o país também, já que pode ser internacional
    return `${streetInfo}, ${addr.city || ''} - ${addr.isoCountryCode || ''}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.infoContainer}>
      <Text style={styles.headerTitle}>Informações do Destino</Text>

      {/* Título do Destino (Fixo) */}
      <View style={styles.card}>
        <Text style={styles.label}>Local:</Text>
        <Text style={styles.valueHighlight}>{DESTINATION.title}</Text>
        <Text style={{color: '#666', marginTop: 2}}>{DESTINATION.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Coordenadas do Destino:</Text>
        <Text style={styles.value}>Lat: {DESTINATION.latitude}</Text>
        <Text style={styles.value}>Lon: {DESTINATION.longitude}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Endereço Completo:</Text>
        <Text style={styles.value}>
          {getFormattedAddress()}
        </Text>
      </View>

      <View style={[styles.card, styles.highlightCard]}>
        <Text style={styles.labelHighlight}>Distância (De você até lá):</Text>
        <Text style={styles.valueHighlight}>
          {(distance / 1000).toFixed(2)} km
        </Text>
        <Text style={styles.subText}>(Cálculo via Fórmula de Haversine)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0050b3' 
},
  subText: 
  { 
    fontSize: 12, 
    color: '#666', 
    fontStyle: 'italic' 
}
});