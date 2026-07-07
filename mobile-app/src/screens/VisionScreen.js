import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const VisionScreen = () => {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, []);

  const captureAndProcess = async () => {
    if (!cameraRef.current) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
      });

      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'http://your-backend-url:5000/api/vision/process-frame',
        { frameBase64: `data:image/jpeg;base64,${photo.base64}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Speak the response
      const voiceText = Object.values(response.data.voiceResponses).join('. ');
      await Speech.speak(voiceText);
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{t('camera_permission_required')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />
      <TouchableOpacity
        style={[styles.button, isProcessing && styles.buttonDisabled]}
        onPress={captureAndProcess}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? t('processing') : t('capture')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default VisionScreen;
