import React, { createContext, useState, useContext } from 'react';

const GroupContext = createContext();

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);

  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  const addPhotoToGroup = (groupId, photoUri) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          photos: [...(group.photos || []), photoUri],
          photoCount: (group.photoCount || 0) + 1
        };
      }
      return group;
    }));
  };

  return (
    <GroupContext.Provider value={{ groups, addGroup, addPhotoToGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupContext);
} 