import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, TextInput, Modal } from 'react-native';
import { useGroups } from '../context/GroupContext';

export default function CurrentGroupsScreen({ navigation }) {
  const { groups, unlockGroup } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleUnlock = () => {
    if (password === '1234') { // In production, use secure password validation
      unlockGroup(selectedGroup.id);
      setShowPasswordModal(false);
      setPassword('');
      navigation.navigate('Group', {
        groupId: selectedGroup.id,
        isUnlocked: true,
        groupName: selectedGroup.name,
        unlockDate: selectedGroup.unlockDate,
        photos: selectedGroup.photos
      });
    } else {
      alert('Incorrect password');
    }
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => navigation.navigate('Group', { 
        groupId: item.id,
        isUnlocked: false,
        groupName: item.name,
        unlockDate: item.unlockDate,
        photos: item.photos
      })}
      onLongPress={() => {
        setSelectedGroup(item);
        setShowPasswordModal(true);
      }}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDetails}>
        Members: {item.members.length} • Photos: {item.photoCount || 0} • Unlocks: {new Date(item.unlockDate).toLocaleDateString()}
      </Text>
      <Text style={styles.hint}>Long press to unlock with password</Text>
    </TouchableOpacity>
  );

  if (groups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No current groups</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={styles.createButtonText}>Create a Group</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password to Unlock</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.unlockButton]}
                onPress={handleUnlock}
              >
                <Text style={styles.buttonText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  groupItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupDetails: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  unlockButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 