import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useGroups } from '../context/GroupContext';

export default function GroupsScreen({ navigation }) {
  const { groups, unlockedGroups } = useGroups();

  const renderGroup = ({ item, isUnlocked }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => navigation.navigate('Group', { 
        groupId: item.id,
        isUnlocked 
      })}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDetails}>
        Members: {Array.isArray(item.members) ? item.members.join(', ') : item.members}
      </Text>
      <Text style={styles.groupDetails}>
        Photos: {item.photoCount || 0}
      </Text>
      <Text style={styles.groupDetails}>
        Unlock Date: {new Date(item.unlockDate).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={styles.createButtonText}>Create New Group</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Locked Groups</Text>
      <FlatList
        data={groups}
        renderItem={({ item }) => renderGroup({ item, isUnlocked: false })}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      <Text style={styles.sectionTitle}>Unlocked Groups</Text>
      <FlatList
        data={unlockedGroups}
        renderItem={({ item }) => renderGroup({ item, isUnlocked: true })}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  groupItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  groupDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  list: {
    flex: 1,
  },
}); 