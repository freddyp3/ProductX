import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

export default function PhotosVideosScreen() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  const pickMedia = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setMedia(prev => [...prev, result.assets[0]]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async (camera) => {
    try {
      setLoading(true);
      const photo = await camera.takePictureAsync();
      setMedia(prev => [...prev, photo]);
      setShowCamera(false);
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMediaItem = ({ item }) => (
    <View style={styles.mediaItem}>
      <Image
        source={{ uri: item.uri }}
        style={styles.mediaImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setMedia(prev => prev.filter(media => media.uri !== item.uri));
        }}>
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photos & Videos</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={() => setShowCamera(true)}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickMedia}>
            <Ionicons name="images" size={24} color="#fff" />
            <Text style={styles.buttonText}>Choose Media</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={media}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.uri}
        numColumns={2}
        contentContainerStyle={styles.mediaGrid}
      />

      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}>
        <View style={styles.cameraContainer}>
          {cameraPermission === 'granted' ? (
            <Camera 
              style={styles.camera} 
              type={Camera.Constants.Type.back}
              ref={cameraRef}>
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCamera(false)}>
                  <Ionicons name="close" size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => takePhoto(cameraRef.current)}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>
              </View>
            </Camera>
          ) : (
            <View style={styles.permissionDenied}>
              <Text style={styles.permissionText}>
                Camera permission is required to take photos
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowCamera(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaGrid: {
    padding: 10,
  },
  mediaItem: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
  permissionDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
}); 