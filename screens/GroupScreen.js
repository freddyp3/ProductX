import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function GroupScreen({ route }) {
  const { groupName, members = [], unlockDate } = route.params || {};
  const unlockDateTime = unlockDate ? new Date(unlockDate) : null;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{groupName}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members:</Text>
          {members.map((member, index) => (
            <Text key={index} style={styles.memberItem}>• {member}</Text>
          ))}
        </View>

        {unlockDateTime && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unlock Date:</Text>
            <Text style={styles.dateText}>{unlockDateTime.toLocaleDateString()}</Text>
          </View>
        )}
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberItem: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 10,
  },
  dateText: {
    fontSize: 16,
    paddingLeft: 10,
  },
}); 