import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const EmergencyScreen = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [sending, setSending] = useState(false);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('error'), t('location_permission_denied'));
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_get_location'));
    }
  };

  const sendEmergencyAlert = async () => {
    if (!location) {
      Alert.alert(t('error'), t('get_location_first'));
      return;
    }

    setSending(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://your-backend-url:5000/api/emergency/alert',
        { location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert(t('success'), t('emergency_alert_sent'));
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_send_alert'));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('emergency_alert')}</Text>
      
      <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
        <Text style={styles.buttonText}>
          {location ? t('location_enabled') : t('get_location')}
        </Text>
      </TouchableOpacity>

      {location && (
        <Text style={styles.locationText}>
          ✓ Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.emergencyButton, sending && styles.buttonDisabled]}
        onPress={sendEmergencyAlert}
        disabled={sending || !location}
      >
        <Text style={styles.emergencyButtonText}>
          {sending ? t('sending') : '🆘 ' + t('send_emergency_alert')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  locationButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  locationText: {
    color: '#28a745',
    fontSize: 14,
    marginBottom: 30,
  },
  emergencyButton: {
    backgroundColor: '#dc3545',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default EmergencyScreen;
