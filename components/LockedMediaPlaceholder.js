import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LockedMediaPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.lockText}>🔒</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  lockText: {
    fontSize: 32,
  },
}); 