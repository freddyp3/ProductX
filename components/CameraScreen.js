import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as ExpoCamera from 'expo-camera';

// Debug log to check if Camera is properly imported
console.log('Camera import:', ExpoCamera);

export default function CameraScreen({ onPhotoTaken }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(ExpoCamera.CameraType.back);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('Requesting camera permissions...');
        const { status } = await ExpoCamera.requestCameraPermissionsAsync();
        console.log('Camera permission status:', status);
        setHasPermission(status === 'granted');
      } catch (err) {
        console.error('Error requesting camera permissions:', err);
        setError(err.message);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        console.log('Attempting to take picture...');
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Picture taken successfully:', photo);
        onPhotoTaken(photo);
      } catch (error) {
        console.error('Error taking picture:', error);
        setError(error.message);
      }
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <ExpoCamera.Camera
          style={StyleSheet.absoluteFillObject}
          type={type}
          ref={cameraRef}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === ExpoCamera.CameraType.back
                  ? ExpoCamera.CameraType.front
                  : ExpoCamera.CameraType.back
              );
            }}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
}); 