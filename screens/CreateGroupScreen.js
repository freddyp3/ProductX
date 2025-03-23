import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGroups } from '../context/GroupContext';

export default function CreateGroupScreen({ navigation }) {
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (memberToRemove) => {
    setMembers(members.filter(member => member !== memberToRemove));
  };

  const handleConfirm = () => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      members: members,
      unlockDate: unlockDate.toISOString(),
      photoCount: 0,
      media: [],
      isUnlocked: false
    };

    addGroup(newGroup);
    navigation.navigate('Home');
  };

  const handleNext = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    if (members.length === 0) {
      alert('Please add at least one member');
      return;
    }

    // Navigate to unlock date screen with the group info
    navigation.navigate('SetUnlockDate', {
      groupName: groupName.trim(),
      members: members
    });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Create New Group</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />

        <View style={styles.memberInputContainer}>
          <TextInput
            style={styles.memberInput}
            placeholder="Enter member's email"
            value={newMember}
            onChangeText={setNewMember}
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddMember}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {members.length > 0 && (
          <View style={styles.membersList}>
            {members.map((member, index) => (
              <View key={index} style={styles.memberItem}>
                <Text>{member}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveMember(member)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  memberInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  memberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  membersList: {
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
}); 