import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGroups } from '../context/GroupContext';

export default function UnlockedGroupsScreen({ navigation }) {
  const { unlockedGroups } = useGroups();

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => navigation.navigate('Group', { 
        groupId: item.id,
        isUnlocked: true  // Explicitly pass isUnlocked as true
      })}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDetails}>
        Photos: {item.photoCount || 0} • Unlocked
      </Text>
    </TouchableOpacity>
  );

  if (unlockedGroups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No unlocked groups yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={unlockedGroups}
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
  },
}); 