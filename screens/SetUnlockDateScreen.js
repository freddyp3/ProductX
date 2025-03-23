import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGroups } from '../context/GroupContext';

export default function SetUnlockDateScreen({ route, navigation }) {
  const { groupName, members } = route.params;
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { addGroup } = useGroups();

  const handleCreateGroup = () => {
    try {
      const newGroup = {
        id: Date.now().toString(),
        name: groupName,
        members: typeof members === 'string' ? members.split(',') : members,
        unlockDate: unlockDate.toISOString(),
        media: [],
        photoCount: 0,
        isLocked: true
      };

      addGroup(newGroup);
      
      // Navigate back to Home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      
      // Show success message
      Alert.alert('Success', 'Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    }
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setUnlockDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Unlock Date</Text>
      
      <View style={styles.groupInfo}>
        <Text style={styles.groupInfoText}>Group Name: {groupName}</Text>
        <Text style={styles.groupInfoText}>
          Members: {Array.isArray(members) ? members.join(', ') : members}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Unlock Date: {unlockDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={unlockDate}
          mode="date"
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateGroup}
      >
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  groupInfo: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  groupInfoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
}); 