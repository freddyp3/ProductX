import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateGroupScreen({ navigation }) {
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

  const handleCreateGroup = () => {
    // TODO: Implement group creation with Firebase
    navigation.navigate('Group', { 
      groupName,
      members,
      unlockDate: unlockDate.toISOString()
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUnlockDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a New Group</Text>
        
        {/* Group Name Input */}
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={setGroupName}
        />

        {/* Member Addition Section */}
        <Text style={styles.label}>Add Members</Text>
        <View style={styles.memberInputContainer}>
          <TextInput
            style={styles.memberInput}
            placeholder="Enter member's email"
            value={newMember}
            onChangeText={setNewMember}
          />
          <Button title="Add" onPress={handleAddMember} />
        </View>

        {/* Members List */}
        {members.length > 0 && (
          <View style={styles.membersList}>
            <Text style={styles.label}>Members:</Text>
            {members.map((member, index) => (
              <View key={index} style={styles.memberItem}>
                <Text>{member}</Text>
                <Button 
                  title="Remove" 
                  onPress={() => handleRemoveMember(member)}
                  color="red"
                />
              </View>
            ))}
          </View>
        )}

        {/* Unlock Date Selection */}
        <Text style={styles.label}>Unlock Date</Text>
        <Button 
          title={`Select Date: ${unlockDate.toLocaleDateString()}`}
          onPress={() => setShowDatePicker(true)}
        />
        
        {showDatePicker && (
          <DateTimePicker
            value={unlockDate}
            mode="date"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Create Group Button */}
        <View style={styles.createButtonContainer}>
          <Button 
            title="Create Group" 
            onPress={handleCreateGroup}
            disabled={!groupName || members.length === 0}
          />
        </View>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  memberInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  memberInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  membersList: {
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  createButtonContainer: {
    marginTop: 20,
  },
}); 